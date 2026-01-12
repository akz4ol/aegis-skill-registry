export interface SkillExecution {
  id: string;
  skillId: string;
  traceId: string;
  spanId: string;
  organizationId: string;
  userId?: string;
  startedAt: Date;
  endedAt?: Date;
  status: ExecutionStatus;
  metadata: ExecutionMetadata;
}

export type ExecutionStatus =
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'TIMEOUT';

export interface ExecutionMetadata {
  policyContext: {
    policyId: string;
    policyVersion: string;
    evaluationResult: string;
  };
  permissionsUsed: string[];
  resourcesAccessed: ResourceAccess[];
  parentSpanId?: string;
}

export interface ResourceAccess {
  type: 'FILE' | 'NETWORK' | 'SHELL' | 'SECRET';
  resource: string;
  operation: string;
  timestamp: Date;
  allowed: boolean;
}

export interface TraceAttributes {
  'aegis.skill.id': string;
  'aegis.skill.name': string;
  'aegis.skill.version': string;
  'aegis.skill.hash': string;
  'aegis.policy.id': string;
  'aegis.policy.version': string;
  'aegis.org.id': string;
  'aegis.approval.id'?: string;
  'aegis.risk.score': number;
  'aegis.risk.level': string;
}

export interface AuditReport {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  organizationId: string;
  generatedAt: Date;
  generatedBy: string;
  summary: AuditSummary;
  details: AuditReportDetails;
}

export interface AuditSummary {
  totalSkills: number;
  totalExecutions: number;
  approvedSkills: number;
  rejectedSkills: number;
  policyViolations: number;
  riskBreakdown: Record<string, number>;
}

export interface AuditReportDetails {
  skillsAnalyzed: SkillAuditEntry[];
  policyEvaluations: PolicyAuditEntry[];
  approvalHistory: ApprovalAuditEntry[];
  executionLog: ExecutionAuditEntry[];
}

export interface SkillAuditEntry {
  skillId: string;
  skillName: string;
  version: string;
  riskScore: number;
  status: string;
  importedAt: Date;
}

export interface PolicyAuditEntry {
  policyId: string;
  policyName: string;
  evaluationsCount: number;
  denials: number;
  approvalRequired: number;
}

export interface ApprovalAuditEntry {
  approvalId: string;
  skillId: string;
  status: string;
  requestedAt: Date;
  decidedAt?: Date;
  decidedBy?: string;
}

export interface ExecutionAuditEntry {
  executionId: string;
  skillId: string;
  startedAt: Date;
  duration: number;
  status: string;
  permissionsUsed: string[];
}
