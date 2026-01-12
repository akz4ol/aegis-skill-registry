export interface SkillSBOM {
  id: string;
  skillId: string;
  sbomHash: string;
  permissions: Permission[];
  networkHints: NetworkHint[];
  fileSystemUsage: FileSystemUsage[];
  shellPatterns: ShellPattern[];
  dependencies: Dependency[];
  generatedAt: Date;
  schemaVersion: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  scope?: string;
}

export interface NetworkHint {
  id: string;
  protocol: string;
  host?: string;
  port?: number;
  direction: 'INBOUND' | 'OUTBOUND' | 'BOTH';
  description?: string;
}

export interface FileSystemUsage {
  id: string;
  path: string;
  operation: 'READ' | 'WRITE' | 'DELETE' | 'EXECUTE';
  required: boolean;
  description?: string;
}

export interface ShellPattern {
  id: string;
  pattern: string;
  riskLevel: RiskLevel;
  description?: string;
}

export interface Dependency {
  id: string;
  name: string;
  version: string;
  type: string;
  license?: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SBOMGenerationResult {
  sbom: SkillSBOM;
  analysisTime: number;
  warnings: string[];
}
