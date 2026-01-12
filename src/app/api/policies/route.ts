import { NextRequest, NextResponse } from 'next/server';
import { policyCreateSchema } from '@/schemas';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isActive = searchParams.get('active');
    const organizationId = searchParams.get('organizationId');

    const where: Record<string, unknown> = {};

    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    const policies = await prisma.policy.findMany({
      where,
      include: {
        rules: true,
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get evaluation stats for each policy
    const policiesWithStats = await Promise.all(
      policies.map(async (policy) => {
        const [evaluations, denials] = await Promise.all([
          prisma.policyResult.count({
            where: { policyName: policy.name },
          }),
          prisma.policyResult.count({
            where: { policyName: policy.name, result: 'DENY' },
          }),
        ]);

        return {
          ...policy,
          evaluationsCount: evaluations,
          denialsCount: denials,
        };
      })
    );

    return NextResponse.json({ policies: policiesWithStats });
  } catch (error) {
    console.error('Error fetching policies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch policies' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = policyCreateSchema.parse(body);

    // Check for existing policy with same name
    const existing = await prisma.policy.findFirst({
      where: { name: input.name, version: input.version },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Policy with this name and version already exists' },
        { status: 409 }
      );
    }

    // Create policy with rules
    const policy = await prisma.policy.create({
      data: {
        name: input.name,
        version: input.version,
        description: input.description,
        isActive: input.isActive,
        organizationId: 'default-org', // In production, get from auth context
        createdById: 'default-user', // In production, get from auth context
        rules: {
          create: input.rules.map((rule, index) => ({
            name: rule.name,
            condition: JSON.stringify(rule.condition),
            action: rule.action,
            priority: rule.priority ?? index,
            message: rule.message,
          })),
        },
      },
      include: {
        rules: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'POLICY_CREATED',
        resourceType: 'policy',
        resourceId: policy.id,
        actorType: 'USER',
        metadata: JSON.stringify({
          policyName: policy.name,
          version: policy.version,
          rulesCount: policy.rules.length,
        }),
      },
    });

    return NextResponse.json({ policy }, { status: 201 });
  } catch (error) {
    console.error('Error creating policy:', error);
    return NextResponse.json(
      { error: 'Failed to create policy' },
      { status: 500 }
    );
  }
}
