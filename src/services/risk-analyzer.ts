import type {
  RiskAnalysis,
  RiskSignal,
  RiskSignalType,
  RiskLevel,
  RiskScoreBreakdown,
  SkillSBOM,
} from '@/types';

const RISK_WEIGHTS: Record<RiskSignalType, number> = {
  SHELL_EXEC: 25,
  NETWORK_ACCESS: 15,
  FILE_WRITE: 15,
  SECRET_ACCESS: 30,
  PRIVILEGE_ESCALATION: 35,
  DATA_EXFILTRATION: 30,
  CODE_EXECUTION: 35,
  DEPENDENCY_VULN: 20,
  UNKNOWN_PERMISSION: 10,
};

const SEVERITY_MULTIPLIERS: Record<RiskLevel, number> = {
  LOW: 0.5,
  MEDIUM: 1.0,
  HIGH: 1.5,
  CRITICAL: 2.0,
};

export class RiskAnalyzerService {
  private analyzerVersion = '1.0.0';

  async analyzeRisk(skillId: string, sbom: SkillSBOM): Promise<RiskAnalysis> {
    const signals = this.detectRiskSignals(sbom);
    const scoreBreakdown = this.calculateRiskScore(signals);

    return {
      id: '',
      skillId,
      riskScore: scoreBreakdown.finalScore,
      riskLevel: this.getRiskLevel(scoreBreakdown.finalScore),
      signals,
      analyzedAt: new Date(),
      analyzerVersion: this.analyzerVersion,
    };
  }

  private detectRiskSignals(sbom: SkillSBOM): RiskSignal[] {
    const signals: RiskSignal[] = [];

    // Analyze shell patterns
    for (const pattern of sbom.shellPatterns) {
      signals.push({
        id: '',
        signalType: 'SHELL_EXEC',
        severity: pattern.riskLevel,
        title: 'Shell Execution Pattern Detected',
        description: `Pattern "${pattern.pattern}" found: ${pattern.description}`,
        location: pattern.description,
        remediation: 'Review shell commands for necessity and security implications',
      });
    }

    // Analyze network hints
    for (const hint of sbom.networkHints) {
      const severity = hint.direction === 'BOTH' ? 'HIGH' : 'MEDIUM';
      signals.push({
        id: '',
        signalType: 'NETWORK_ACCESS',
        severity,
        title: 'Network Access Required',
        description: `${hint.protocol} ${hint.direction} access: ${hint.description}`,
        remediation: 'Ensure network access is to trusted endpoints only',
      });
    }

    // Analyze filesystem usage
    for (const usage of sbom.fileSystemUsage) {
      const severity =
        usage.operation === 'WRITE' || usage.operation === 'DELETE'
          ? 'MEDIUM'
          : 'LOW';
      signals.push({
        id: '',
        signalType: 'FILE_WRITE',
        severity,
        title: `File ${usage.operation} Access`,
        description: `${usage.operation} access to ${usage.path}: ${usage.description}`,
        location: usage.path,
        remediation: 'Restrict file operations to necessary paths only',
      });
    }

    // Analyze permissions
    const dangerousPerms = sbom.permissions.filter(
      (p) => p.name === 'shell' || p.scope === 'system'
    );
    for (const perm of dangerousPerms) {
      signals.push({
        id: '',
        signalType: 'CODE_EXECUTION',
        severity: 'HIGH',
        title: 'Dangerous Permission Required',
        description: `Permission "${perm.name}" is potentially dangerous: ${perm.description}`,
        remediation: 'Evaluate if this permission is strictly necessary',
      });
    }

    return signals;
  }

  private calculateRiskScore(signals: RiskSignal[]): RiskScoreBreakdown {
    let baseScore = 0;
    const modifiers: { name: string; impact: number; reason: string }[] = [];

    for (const signal of signals) {
      const weight = RISK_WEIGHTS[signal.signalType] || 10;
      const multiplier = SEVERITY_MULTIPLIERS[signal.severity];
      const impact = Math.round(weight * multiplier);

      modifiers.push({
        name: signal.signalType,
        impact,
        reason: signal.title,
      });

      baseScore += impact;
    }

    // Cap at 100
    const finalScore = Math.min(100, baseScore);

    return { baseScore, modifiers, finalScore };
  }

  private getRiskLevel(score: number): RiskLevel {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 30) return 'MEDIUM';
    return 'LOW';
  }

  generateRiskReport(analysis: RiskAnalysis): string {
    const lines = [
      `# Risk Analysis Report`,
      ``,
      `**Risk Score:** ${analysis.riskScore}/100`,
      `**Risk Level:** ${analysis.riskLevel}`,
      `**Analyzed:** ${analysis.analyzedAt.toISOString()}`,
      `**Analyzer Version:** ${analysis.analyzerVersion}`,
      ``,
      `## Risk Signals (${analysis.signals.length})`,
      ``,
    ];

    for (const signal of analysis.signals) {
      lines.push(`### ${signal.title}`);
      lines.push(`- **Type:** ${signal.signalType}`);
      lines.push(`- **Severity:** ${signal.severity}`);
      lines.push(`- **Description:** ${signal.description}`);
      if (signal.location) {
        lines.push(`- **Location:** ${signal.location}`);
      }
      if (signal.remediation) {
        lines.push(`- **Remediation:** ${signal.remediation}`);
      }
      lines.push('');
    }

    return lines.join('\n');
  }
}

export const riskAnalyzerService = new RiskAnalyzerService();
