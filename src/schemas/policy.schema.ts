import { z } from 'zod';

export const policyActionSchema = z.enum([
  'ALLOW',
  'DENY',
  'REQUIRE_APPROVAL',
  'WARN',
]);

export const conditionOperatorSchema = z.enum([
  'eq',
  'neq',
  'gt',
  'gte',
  'lt',
  'lte',
  'in',
  'nin',
  'contains',
  'matches',
]);

export const conditionTypeSchema = z.enum([
  'AND',
  'OR',
  'NOT',
  'FIELD',
  'EXISTS',
  'MATCH',
]);

export const policyConditionSchema: z.ZodType<{
  type: string;
  field?: string;
  operator?: string;
  value?: unknown;
  conditions?: unknown[];
}> = z.lazy(() =>
  z.object({
    type: conditionTypeSchema,
    field: z.string().optional(),
    operator: conditionOperatorSchema.optional(),
    value: z.unknown().optional(),
    conditions: z.array(policyConditionSchema).optional(),
  })
);

export const policyRuleSchema = z.object({
  name: z.string().min(1).max(100),
  condition: policyConditionSchema,
  action: policyActionSchema,
  priority: z.number().int().min(0).max(1000).default(0),
  message: z.string().max(500).optional(),
});

export const policyCreateSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Name must be lowercase alphanumeric with hyphens'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be semver format'),
  description: z.string().max(1000).optional(),
  rules: z.array(policyRuleSchema).min(1).max(50),
  isActive: z.boolean().default(true),
});

export const policyEvaluateSchema = z.object({
  skillId: z.string().cuid(),
  policyId: z.string().cuid().optional(),
  isDryRun: z.boolean().default(false),
});

export type PolicyRuleInput = z.infer<typeof policyRuleSchema>;
export type PolicyCreateInput = z.infer<typeof policyCreateSchema>;
export type PolicyEvaluateInput = z.infer<typeof policyEvaluateSchema>;
