import { z } from 'zod';

export const approvalStatusSchema = z.enum([
  'PENDING',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
  'INVALIDATED',
]);

export const approvalRequestSchema = z.object({
  skillId: z.string().cuid(),
  reason: z.string().min(10).max(1000),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

export const approvalDecisionSchema = z.object({
  approvalId: z.string().cuid(),
  status: z.enum(['APPROVED', 'REJECTED']),
  reason: z.string().max(1000).optional(),
});

export const approvalQuerySchema = z.object({
  status: approvalStatusSchema.optional(),
  skillId: z.string().cuid().optional(),
  requestedById: z.string().cuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type ApprovalRequestInput = z.infer<typeof approvalRequestSchema>;
export type ApprovalDecisionInput = z.infer<typeof approvalDecisionSchema>;
export type ApprovalQueryInput = z.infer<typeof approvalQuerySchema>;
