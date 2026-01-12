export type ApprovalStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'INVALIDATED';

export interface ApprovalRecord {
  id: string;
  skillId: string;
  skillHash: string;
  policyVersion: string;
  status: ApprovalStatus;
  requestedAt: Date;
  decidedAt?: Date;
  requestedById: string;
  decidedById?: string;
  reason?: string;
  expiresAt?: Date;
}

export interface ApprovalRequest {
  skillId: string;
  reason: string;
  requestedById: string;
  expiresInDays?: number;
}

export interface ApprovalDecision {
  approvalId: string;
  status: 'APPROVED' | 'REJECTED';
  decidedById: string;
  reason?: string;
}

export interface ApprovalWorkflowConfig {
  requiredApprovers: number;
  approverRoles: string[];
  autoExpireDays: number;
  requireJustification: boolean;
  notifyOnRequest: boolean;
  notifyOnDecision: boolean;
}
