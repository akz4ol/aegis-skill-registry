import { NextRequest, NextResponse } from 'next/server';
import { approvalRequestSchema, approvalQuerySchema } from '@/schemas';
import { prisma } from '@/lib/db';
import { policyEvaluatorService } from '@/services/policy-evaluator';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = approvalQuerySchema.parse({
      status: searchParams.get('status') || undefined,
      skillId: searchParams.get('skillId') || undefined,
      requestedById: searchParams.get('requestedById') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
    });

    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.skillId) {
      where.skillId = query.skillId;
    }

    if (query.requestedById) {
      where.requestedById = query.requestedById;
    }

    const [approvals, total] = await Promise.all([
      prisma.approvalRecord.findMany({
        where,
        include: {
          skill: {
            select: {
              id: true,
              name: true,
              version: true,
              contentHash: true,
            },
          },
          requestedBy: { select: { id: true, name: true, email: true } },
          decidedBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { requestedAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.approvalRecord.count({ where }),
    ]);

    return NextResponse.json({
      approvals,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching approvals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch approvals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = approvalRequestSchema.parse(body);

    // Get skill details
    const skill = await prisma.skill.findUnique({
      where: { id: input.skillId },
      include: { sbom: true, riskAnalysis: true },
    });

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    // Check if there's already a pending approval
    const existingApproval = await prisma.approvalRecord.findFirst({
      where: {
        skillId: input.skillId,
        skillHash: skill.contentHash,
        status: 'PENDING',
      },
    });

    if (existingApproval) {
      return NextResponse.json(
        { error: 'A pending approval already exists for this skill version' },
        { status: 409 }
      );
    }

    // Get active policies
    const policies = await prisma.policy.findMany({
      where: { isActive: true },
      include: { rules: true },
    });

    // Evaluate policies
    const policyResults = [];
    for (const policy of policies) {
      const context = {
        skill: {
          name: skill.name,
          version: skill.version,
          contentHash: skill.contentHash,
        },
        sbom: {
          permissions: [],
          networkHints: [],
          shellPatterns: [],
          riskScore: skill.riskAnalysis?.riskScore || 0,
          riskLevel: skill.riskAnalysis?.riskLevel || 'LOW',
        },
        organization: {
          id: 'default-org',
          settings: {},
        },
      };

      const result = await policyEvaluatorService.evaluatePolicy(
        {
          ...policy,
          rules: policy.rules.map((r) => ({
            ...r,
            condition: JSON.parse(r.condition),
          })),
        },
        context
      );

      policyResults.push(result);

      // Store policy result
      await prisma.policyResult.create({
        data: {
          skillId: skill.id,
          policyName: policy.name,
          version: policy.version,
          result: result.result,
          violations: JSON.stringify(result.violations),
        },
      });
    }

    // Create approval record
    const expiresAt = input.expiresInDays
      ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const approval = await prisma.approvalRecord.create({
      data: {
        skillId: input.skillId,
        skillHash: skill.contentHash,
        policyVersion: policies.map((p) => `${p.name}@${p.version}`).join(','),
        status: 'PENDING',
        requestedById: 'default-user', // In production, get from auth
        reason: input.reason,
        expiresAt,
      },
      include: {
        skill: true,
        requestedBy: true,
      },
    });

    // Create provenance entry
    await prisma.provenanceEntry.create({
      data: {
        skillId: skill.id,
        eventType: 'APPROVAL_REQUESTED',
        metadata: JSON.stringify({
          approvalId: approval.id,
          reason: input.reason,
          policyResults: policyResults.map((r) => ({
            policy: r.policyName,
            result: r.result,
          })),
        }),
      },
    });

    return NextResponse.json(
      {
        approval,
        policyResults,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating approval request:', error);
    return NextResponse.json(
      { error: 'Failed to create approval request' },
      { status: 500 }
    );
  }
}
