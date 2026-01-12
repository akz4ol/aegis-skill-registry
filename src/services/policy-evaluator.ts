import type {
  Policy,
  PolicyRule,
  PolicyCondition,
  PolicyResult,
  PolicyViolation,
  PolicyAction,
  PolicyEvaluationContext,
} from '@/types';

export class PolicyEvaluatorService {
  async evaluatePolicy(
    policy: Policy,
    context: PolicyEvaluationContext,
    isDryRun: boolean = false
  ): Promise<PolicyResult> {
    const violations: PolicyViolation[] = [];
    let finalAction: PolicyAction = 'ALLOW';

    // Sort rules by priority (higher priority first)
    const sortedRules = [...policy.rules].sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      const conditionMet = this.evaluateCondition(rule.condition, context);

      if (conditionMet) {
        if (rule.action === 'DENY') {
          finalAction = 'DENY';
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            message: rule.message || `Rule "${rule.name}" denied the skill`,
            severity: 'HIGH',
          });
        } else if (rule.action === 'REQUIRE_APPROVAL' && finalAction !== 'DENY') {
          finalAction = 'REQUIRE_APPROVAL';
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            message: rule.message || `Rule "${rule.name}" requires approval`,
            severity: 'MEDIUM',
          });
        } else if (rule.action === 'WARN') {
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            message: rule.message || `Warning from rule "${rule.name}"`,
            severity: 'LOW',
          });
        }
      }
    }

    return {
      id: '',
      skillId: context.skill.contentHash,
      policyName: policy.name,
      version: policy.version,
      result: finalAction,
      violations,
      evaluatedAt: new Date(),
      isDryRun,
    };
  }

  private evaluateCondition(
    condition: PolicyCondition,
    context: PolicyEvaluationContext
  ): boolean {
    switch (condition.type) {
      case 'AND':
        return (condition.conditions || []).every((c) =>
          this.evaluateCondition(c as PolicyCondition, context)
        );

      case 'OR':
        return (condition.conditions || []).some((c) =>
          this.evaluateCondition(c as PolicyCondition, context)
        );

      case 'NOT':
        return !(condition.conditions || []).some((c) =>
          this.evaluateCondition(c as PolicyCondition, context)
        );

      case 'FIELD':
        return this.evaluateFieldCondition(condition, context);

      case 'EXISTS':
        return this.fieldExists(condition.field || '', context);

      case 'MATCH':
        return this.evaluateMatchCondition(condition, context);

      default:
        return false;
    }
  }

  private evaluateFieldCondition(
    condition: PolicyCondition,
    context: PolicyEvaluationContext
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field || '', context);
    const { operator, value } = condition;

    switch (operator) {
      case 'eq':
        return fieldValue === value;
      case 'neq':
        return fieldValue !== value;
      case 'gt':
        return (fieldValue as number) > (value as number);
      case 'gte':
        return (fieldValue as number) >= (value as number);
      case 'lt':
        return (fieldValue as number) < (value as number);
      case 'lte':
        return (fieldValue as number) <= (value as number);
      case 'in':
        return (value as unknown[]).includes(fieldValue);
      case 'nin':
        return !(value as unknown[]).includes(fieldValue);
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(value);
        }
        return String(fieldValue).includes(String(value));
      case 'matches':
        return new RegExp(String(value)).test(String(fieldValue));
      default:
        return false;
    }
  }

  private evaluateMatchCondition(
    condition: PolicyCondition,
    context: PolicyEvaluationContext
  ): boolean {
    const fieldValue = this.getFieldValue(condition.field || '', context);
    const pattern = new RegExp(String(condition.value));
    return pattern.test(String(fieldValue));
  }

  private getFieldValue(
    path: string,
    context: PolicyEvaluationContext
  ): unknown {
    const parts = path.split('.');
    let value: unknown = context;

    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = (value as Record<string, unknown>)[part];
    }

    return value;
  }

  private fieldExists(path: string, context: PolicyEvaluationContext): boolean {
    return this.getFieldValue(path, context) !== undefined;
  }

  // Predefined policy templates
  static getDefaultPolicies(): Omit<Policy, 'id' | 'organizationId' | 'createdById'>[] {
    return [
      {
        name: 'block-high-risk',
        version: '1.0.0',
        description: 'Block skills with risk score above 80',
        rules: [
          {
            id: 'rule-1',
            policyId: '',
            name: 'Block Critical Risk',
            condition: {
              type: 'FIELD',
              field: 'sbom.riskScore',
              operator: 'gte',
              value: 80,
            },
            action: 'DENY',
            priority: 100,
            message: 'Skills with critical risk scores are not allowed',
          },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'require-approval-shell',
        version: '1.0.0',
        description: 'Require approval for skills with shell access',
        rules: [
          {
            id: 'rule-2',
            policyId: '',
            name: 'Shell Access Approval',
            condition: {
              type: 'FIELD',
              field: 'sbom.permissions',
              operator: 'contains',
              value: 'shell',
            },
            action: 'REQUIRE_APPROVAL',
            priority: 90,
            message: 'Skills with shell access require explicit approval',
          },
        ],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}

export const policyEvaluatorService = new PolicyEvaluatorService();
