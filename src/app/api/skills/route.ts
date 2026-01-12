import { NextRequest, NextResponse } from 'next/server';
import { skillQuerySchema, skillImportSchema } from '@/schemas';
import { prisma } from '@/lib/db';
import { skillIngestionService } from '@/services/skill-ingestion';
import { sbomGeneratorService } from '@/services/sbom-generator';
import { riskAnalyzerService } from '@/services/risk-analyzer';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = skillQuerySchema.parse({
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      riskLevel: searchParams.get('riskLevel') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      sortBy: searchParams.get('sortBy') || 'createdAt',
      sortOrder: searchParams.get('sortOrder') || 'desc',
    });

    const where: Record<string, unknown> = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.riskLevel) {
      where.riskAnalysis = { riskLevel: query.riskLevel };
    }

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        include: {
          riskAnalysis: true,
          tags: true,
          signatures: { take: 1 },
          approvals: { where: { status: 'APPROVED' }, take: 1 },
        },
        orderBy: { [query.sortBy]: query.sortOrder },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.skill.count({ where }),
    ]);

    const items = skills.map((skill) => ({
      ...skill,
      riskScore: skill.riskAnalysis?.riskScore || 0,
      riskLevel: skill.riskAnalysis?.riskLevel || 'LOW',
      tags: skill.tags.map((t) => t.name),
      isVerified: skill.signatures.length > 0,
      approvalStatus: skill.approvals[0]?.status || null,
    }));

    return NextResponse.json({
      items,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = skillImportSchema.parse(body);

    // Import skill
    const ingestionResult = await skillIngestionService.importSkill(input);
    if (!ingestionResult.success || !ingestionResult.skill) {
      return NextResponse.json(
        { error: ingestionResult.error || 'Import failed' },
        { status: 400 }
      );
    }

    const { skill: normalizedSkill, files } = ingestionResult.skill;

    // Create skill record
    const skill = await prisma.skill.create({
      data: {
        name: normalizedSkill.name,
        version: normalizedSkill.version,
        description: normalizedSkill.description,
        contentHash: normalizedSkill.contentHash,
        sourceType: normalizedSkill.sourceType,
        sourceUrl: normalizedSkill.sourceUrl,
        rawArtifactPath: normalizedSkill.rawArtifactPath,
        status: 'DRAFT',
      },
    });

    // Generate SBOM
    const fileContents = files.map((f) => ({
      path: f.path,
      content: '', // In production, read actual content
    }));
    const sbomResult = await sbomGeneratorService.generateSBOM(
      skill.id,
      fileContents
    );

    // Create SBOM record
    await prisma.skillSBOM.create({
      data: {
        skillId: skill.id,
        sbomHash: sbomResult.sbom.sbomHash,
        schemaVersion: sbomResult.sbom.schemaVersion,
      },
    });

    // Run risk analysis
    const riskAnalysis = await riskAnalyzerService.analyzeRisk(
      skill.id,
      sbomResult.sbom
    );

    await prisma.riskAnalysis.create({
      data: {
        skillId: skill.id,
        riskScore: riskAnalysis.riskScore,
        riskLevel: riskAnalysis.riskLevel,
        analyzerVersion: riskAnalysis.analyzerVersion,
      },
    });

    // Update skill status
    await prisma.skill.update({
      where: { id: skill.id },
      data: { status: 'PENDING_REVIEW' },
    });

    // Create provenance entry
    await prisma.provenanceEntry.create({
      data: {
        skillId: skill.id,
        eventType: 'IMPORTED',
        metadata: JSON.stringify({
          source: input.gitUrl || input.archivePath || input.localPath,
          filesCount: files.length,
        }),
      },
    });

    return NextResponse.json({
      skill,
      sbom: sbomResult.sbom,
      riskAnalysis,
      warnings: sbomResult.warnings,
    });
  } catch (error) {
    console.error('Error importing skill:', error);
    return NextResponse.json(
      { error: 'Failed to import skill' },
      { status: 500 }
    );
  }
}
