import type { RiskLevel } from './sbom';

export interface RiskAnalysis {
  id: string;
  skillId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  signals: RiskSignal[];
  analyzedAt: Date;
  analyzerVersion: string;
}

export interface RiskSignal {
  id: string;
  signalType: RiskSignalType;
  severity: RiskLevel;
  title: string;
  description: string;
  location?: string;
  remediation?: string;
}

export type RiskSignalType =
  | 'SHELL_EXEC'
  | 'NETWORK_ACCESS'
  | 'FILE_WRITE'
  | 'SECRET_ACCESS'
  | 'PRIVILEGE_ESCALATION'
  | 'DATA_EXFILTRATION'
  | 'CODE_EXECUTION'
  | 'DEPENDENCY_VULN'
  | 'UNKNOWN_PERMISSION';

export interface RiskScoreBreakdown {
  baseScore: number;
  modifiers: RiskModifier[];
  finalScore: number;
}

export interface RiskModifier {
  name: string;
  impact: number;
  reason: string;
}

export interface RiskAnalysisConfig {
  shellExecWeight: number;
  networkWeight: number;
  fileWriteWeight: number;
  secretAccessWeight: number;
  thresholds: {
    low: number;
    medium: number;
    high: number;
  };
}
