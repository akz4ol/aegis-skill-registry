import { z } from 'zod';

export const sourceTypeSchema = z.enum(['GIT', 'ARCHIVE', 'LOCAL']);

export const skillStatusSchema = z.enum([
  'DRAFT',
  'PENDING_REVIEW',
  'APPROVED',
  'REJECTED',
  'DEPRECATED',
  'REVOKED',
]);

export const skillImportSchema = z
  .object({
    gitUrl: z.string().url().optional(),
    archivePath: z.string().optional(),
    localPath: z.string().optional(),
  })
  .refine(
    (data) => data.gitUrl || data.archivePath || data.localPath,
    'At least one import source must be provided'
  );

export const skillCreateSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Name must be lowercase alphanumeric with hyphens'),
  version: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in semver format (x.y.z)'),
  description: z.string().max(1000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

export const skillQuerySchema = z.object({
  status: skillStatusSchema.optional(),
  search: z.string().max(100).optional(),
  tags: z.array(z.string()).optional(),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'createdAt', 'riskScore', 'version']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SkillImportInput = z.infer<typeof skillImportSchema>;
export type SkillCreateInput = z.infer<typeof skillCreateSchema>;
export type SkillQueryInput = z.infer<typeof skillQuerySchema>;
