export type PolicyAction = 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'WARN';

export interface Policy {
  id: string;
  name: string;
  version: string;
  description?: string | null;
  organizationId: string;
  rules: PolicyRule[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}

export interface PolicyRule {
  id: string;
  policyId: string;
  name: string;
  condition: PolicyCondition;
  action: PolicyAction;
  priority: number;
  message?: string | null;
}

export interface PolicyCondition {
  type: ConditionType;
  field?: string;
  operator?: ConditionOperator;
  value?: unknown;
  conditions?: PolicyCondition[];
}

export type ConditionType = 'AND' | 'OR' | 'NOT' | 'FIELD' | 'EXISTS' | 'MATCH';

export type ConditionOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'in'
  | 'nin'
  | 'contains'
  | 'matches';

export interface PolicyResult {
  id: string;
  skillId: string;
  policyName: string;
  version: string;
  result: PolicyAction;
  violations: PolicyViolation[];
  evaluatedAt: Date;
  isDryRun: boolean;
}

export interface PolicyViolation {
  ruleId: string;
  ruleName: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  field?: string;
  actualValue?: unknown;
  expectedValue?: unknown;
}

export interface PolicyEvaluationContext {
  skill: {
    name: string;
    version: string;
    contentHash: string;
  };
  sbom: {
    permissions: string[];
    networkHints: string[];
    shellPatterns: string[];
    riskScore: number;
    riskLevel: string;
  };
  organization: {
    id: string;
    settings: Record<string, unknown>;
  };
}
