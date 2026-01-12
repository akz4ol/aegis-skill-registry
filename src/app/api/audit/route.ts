import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const auditQuerySchema = z.object({
  eventType: z.string().optional(),
  resourceType: z.string().optional(),
  resourceId: z.string().optional(),
  actorId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = auditQuerySchema.parse({
      eventType: searchParams.get('eventType') || undefined,
      resourceType: searchParams.get('resourceType') || undefined,
      resourceId: searchParams.get('resourceId') || undefined,
      actorId: searchParams.get('actorId') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 50,
    });

    const where: Record<string, unknown> = {};

    if (query.eventType) {
      where.action = query.eventType;
    }

    if (query.resourceType) {
      where.resourceType = query.resourceType;
    }

    if (query.resourceId) {
      where.resourceId = query.resourceId;
    }

    if (query.actorId) {
      where.actorId = query.actorId;
    }

    if (query.startDate || query.endDate) {
      where.timestamp = {};
      if (query.startDate) {
        (where.timestamp as Record<string, Date>).gte = new Date(query.startDate);
      }
      if (query.endDate) {
        (where.timestamp as Record<string, Date>).lte = new Date(query.endDate);
      }
    }

    const [entries, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    // Parse metadata JSON
    const items = entries.map((entry) => ({
      ...entry,
      metadata: entry.metadata ? JSON.parse(entry.metadata) : null,
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
    console.error('Error fetching audit log:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit log' },
      { status: 500 }
    );
  }
}

// Export endpoint for audit reports
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, startDate, endDate, skillId } = body;

    const where: Record<string, unknown> = {};

    if (skillId) {
      where.resourceId = skillId;
      where.resourceType = 'skill';
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        (where.timestamp as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        (where.timestamp as Record<string, Date>).lte = new Date(endDate);
      }
    }

    const entries = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });

    // Format based on requested type
    if (format === 'json') {
      return NextResponse.json({
        exportedAt: new Date().toISOString(),
        count: entries.length,
        entries: entries.map((e) => ({
          ...e,
          metadata: e.metadata ? JSON.parse(e.metadata) : null,
        })),
      });
    }

    if (format === 'csv') {
      const headers = [
        'timestamp',
        'action',
        'actorId',
        'actorType',
        'resourceType',
        'resourceId',
      ];
      const rows = entries.map((e) =>
        [
          e.timestamp.toISOString(),
          e.action,
          e.actorId || '',
          e.actorType,
          e.resourceType,
          e.resourceId,
        ].join(',')
      );

      const csv = [headers.join(','), ...rows].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="audit-export-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting audit log:', error);
    return NextResponse.json(
      { error: 'Failed to export audit log' },
      { status: 500 }
    );
  }
}
