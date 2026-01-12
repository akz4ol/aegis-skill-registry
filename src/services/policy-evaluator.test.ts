import { describe, it, expect } from 'vitest';
import { PolicyEvaluatorService } from './policy-evaluator';
import type { Policy, PolicyEvaluationContext } from '@/types';

describe('PolicyEvaluatorService', () => {
  const service = new PolicyEvaluatorService();

  const baseContext: PolicyEvaluationContext = {
    skill: {
      name: 'test-skill',
      version: '1.0.0',
      contentHash: 'abc123',
    },
    sbom: {
      permissions: ['network', 'filesystem'],
      networkHints: ['https'],
      shellPatterns: [],
      riskScore: 45,
      riskLevel: 'MEDIUM',
    },
    organization: {
      id: 'org-1',
      settings: {},
    },
  };

  describe('evaluatePolicy', () => {
    it('should ALLOW when no rules match', async () => {
      const policy: Policy = {
        id: 'policy-1',
        name: 'test-policy',
        version: '1.0.0',
        organizationId: 'org-1',
        rules: [
          {
            id: 'rule-1',
            policyId: 'policy-1',
            name: 'Block high risk',
            condition: {
              type: 'FIELD',
              field: 'sbom.riskScore',
              operator: 'gte',
              value: 80,
            },
            action: 'DENY',
            priority: 100,
          },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: 'user-1',
      };

      const result = await service.evaluatePolicy(policy, baseContext);
      expect(result.result).toBe('ALLOW');
      expect(result.violations).toHaveLength(0);
    });

    it('should DENY when risk score exceeds threshold', async () => {
      const policy: Policy = {
        id: 'policy-1',
        name: 'test-policy',
        version: '1.0.0',
        organizationId: 'org-1',
        rules: [
          {
            id: 'rule-1',
            policyId: 'policy-1',
            name: 'Block high risk',
            condition: {
              type: 'FIELD',
              field: 'sbom.riskScore',
              operator: 'gte',
              value: 40,
            },
            action: 'DENY',
            priority: 100,
            message: 'Risk too high',
          },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: 'user-1',
      };

      const result = await service.evaluatePolicy(policy, baseContext);
      expect(result.result).toBe('DENY');
      expect(result.violations).toHaveLength(1);
      expect(result.violations[0].message).toBe('Risk too high');
    });

    it('should REQUIRE_APPROVAL for medium risk', async () => {
      const policy: Policy = {
        id: 'policy-1',
        name: 'test-policy',
        version: '1.0.0',
        organizationId: 'org-1',
        rules: [
          {
            id: 'rule-1',
            policyId: 'policy-1',
            name: 'Require approval for network',
            condition: {
              type: 'FIELD',
              field: 'sbom.permissions',
              operator: 'contains',
              value: 'network',
            },
            action: 'REQUIRE_APPROVAL',
            priority: 50,
          },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: 'user-1',
      };

      const result = await service.evaluatePolicy(policy, baseContext);
      expect(result.result).toBe('REQUIRE_APPROVAL');
    });

    it('should evaluate AND conditions correctly', async () => {
      const policy: Policy = {
        id: 'policy-1',
        name: 'test-policy',
        version: '1.0.0',
        organizationId: 'org-1',
        rules: [
          {
            id: 'rule-1',
            policyId: 'policy-1',
            name: 'Complex condition',
            condition: {
              type: 'AND',
              conditions: [
                {
                  type: 'FIELD',
                  field: 'sbom.riskScore',
                  operator: 'gte',
                  value: 30,
                },
                {
                  type: 'FIELD',
                  field: 'sbom.permissions',
                  operator: 'contains',
                  value: 'network',
                },
              ],
            },
            action: 'WARN',
            priority: 50,
          },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: 'user-1',
      };

      const result = await service.evaluatePolicy(policy, baseContext);
      expect(result.violations).toHaveLength(1);
      expect(result.result).toBe('ALLOW'); // WARN doesn't change result
    });

    it('should respect rule priority', async () => {
      const policy: Policy = {
        id: 'policy-1',
        name: 'test-policy',
        version: '1.0.0',
        organizationId: 'org-1',
        rules: [
          {
            id: 'rule-1',
            policyId: 'policy-1',
            name: 'Low priority allow',
            condition: {
              type: 'FIELD',
              field: 'sbom.riskScore',
              operator: 'lt',
              value: 100,
            },
            action: 'ALLOW',
            priority: 10,
          },
          {
            id: 'rule-2',
            policyId: 'policy-1',
            name: 'High priority deny',
            condition: {
              type: 'FIELD',
              field: 'sbom.riskScore',
              operator: 'gte',
              value: 40,
            },
            action: 'DENY',
            priority: 100,
          },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: 'user-1',
      };

      const result = await service.evaluatePolicy(policy, baseContext);
      expect(result.result).toBe('DENY');
    });
  });

  describe('getDefaultPolicies', () => {
    it('should return predefined policies', () => {
      const policies = PolicyEvaluatorService.getDefaultPolicies();
      expect(policies.length).toBeGreaterThan(0);
      expect(policies[0].name).toBeDefined();
      expect(policies[0].rules.length).toBeGreaterThan(0);
    });
  });
});
