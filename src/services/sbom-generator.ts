import { computeContentHash, generateSBOMHash } from '@/lib/hash';
import type {
  SkillSBOM,
  Permission,
  NetworkHint,
  FileSystemUsage,
  ShellPattern,
  Dependency,
  RiskLevel,
  SBOMGenerationResult,
} from '@/types';

const SHELL_PATTERNS = [
  { pattern: /subprocess|exec|spawn|system\(/gi, risk: 'HIGH' as RiskLevel },
  { pattern: /eval\(|exec\(|compile\(/gi, risk: 'CRITICAL' as RiskLevel },
  { pattern: /os\.system|os\.popen/gi, risk: 'HIGH' as RiskLevel },
  { pattern: /child_process/gi, risk: 'HIGH' as RiskLevel },
  { pattern: /\$\(.*\)|`.*`/g, risk: 'MEDIUM' as RiskLevel },
];

const NETWORK_PATTERNS = [
  { pattern: /fetch\(|axios|http\.request|https\.request/gi, hint: 'HTTP_CLIENT' },
  { pattern: /websocket|ws\./gi, hint: 'WEBSOCKET' },
  { pattern: /net\.connect|socket/gi, hint: 'TCP_SOCKET' },
  { pattern: /dns\.lookup|dns\.resolve/gi, hint: 'DNS' },
];

const FS_PATTERNS = [
  { pattern: /fs\.write|writeFile|writeFileSync/gi, op: 'WRITE' },
  { pattern: /fs\.read|readFile|readFileSync/gi, op: 'READ' },
  { pattern: /fs\.unlink|rm|rmdir/gi, op: 'DELETE' },
  { pattern: /fs\.chmod|chown/gi, op: 'EXECUTE' },
];

const SECRET_PATTERNS = [
  /api[_-]?key/gi,
  /secret/gi,
  /password/gi,
  /token/gi,
  /credential/gi,
  /private[_-]?key/gi,
];

export class SBOMGeneratorService {
  async generateSBOM(
    skillId: string,
    files: Array<{ path: string; content: string }>
  ): Promise<SBOMGenerationResult> {
    const startTime = Date.now();
    const warnings: string[] = [];

    const permissions = this.analyzePermissions(files);
    const networkHints = this.analyzeNetworkHints(files);
    const fileSystemUsage = this.analyzeFileSystemUsage(files);
    const shellPatterns = this.analyzeShellPatterns(files);
    const dependencies = await this.analyzeDependencies(files);

    const sbom: SkillSBOM = {
      id: '',
      skillId,
      sbomHash: '',
      permissions,
      networkHints,
      fileSystemUsage,
      shellPatterns,
      dependencies,
      generatedAt: new Date(),
      schemaVersion: '1.0.0',
    };

    sbom.sbomHash = generateSBOMHash(sbom);

    if (shellPatterns.some((p) => p.riskLevel === 'CRITICAL')) {
      warnings.push('Critical shell execution patterns detected');
    }

    if (this.detectSecretPatterns(files)) {
      warnings.push('Potential secret/credential access patterns detected');
    }

    return {
      sbom,
      analysisTime: Date.now() - startTime,
      warnings,
    };
  }

  private analyzePermissions(
    files: Array<{ path: string; content: string }>
  ): Permission[] {
    const permissions: Permission[] = [];
    const allContent = files.map((f) => f.content).join('\n');

    if (NETWORK_PATTERNS.some((p) => p.pattern.test(allContent))) {
      permissions.push({
        id: '',
        name: 'network',
        description: 'Network access required',
        required: true,
        scope: 'outbound',
      });
    }

    if (FS_PATTERNS.some((p) => p.pattern.test(allContent))) {
      permissions.push({
        id: '',
        name: 'filesystem',
        description: 'File system access required',
        required: true,
      });
    }

    if (SHELL_PATTERNS.some((p) => p.pattern.test(allContent))) {
      permissions.push({
        id: '',
        name: 'shell',
        description: 'Shell/subprocess execution required',
        required: true,
      });
    }

    return permissions;
  }

  private analyzeNetworkHints(
    files: Array<{ path: string; content: string }>
  ): NetworkHint[] {
    const hints: NetworkHint[] = [];
    const allContent = files.map((f) => f.content).join('\n');

    for (const { pattern, hint } of NETWORK_PATTERNS) {
      if (pattern.test(allContent)) {
        hints.push({
          id: '',
          protocol: hint.includes('WEBSOCKET') ? 'wss' : 'https',
          direction: 'OUTBOUND',
          description: `Detected ${hint} usage`,
        });
      }
    }

    return hints;
  }

  private analyzeFileSystemUsage(
    files: Array<{ path: string; content: string }>
  ): FileSystemUsage[] {
    const usage: FileSystemUsage[] = [];
    const allContent = files.map((f) => f.content).join('\n');

    for (const { pattern, op } of FS_PATTERNS) {
      if (pattern.test(allContent)) {
        usage.push({
          id: '',
          path: '*',
          operation: op as 'READ' | 'WRITE' | 'DELETE' | 'EXECUTE',
          required: false,
          description: `File ${op.toLowerCase()} operations detected`,
        });
      }
    }

    return usage;
  }

  private analyzeShellPatterns(
    files: Array<{ path: string; content: string }>
  ): ShellPattern[] {
    const patterns: ShellPattern[] = [];

    for (const file of files) {
      for (const { pattern, risk } of SHELL_PATTERNS) {
        const matches = file.content.match(pattern);
        if (matches) {
          patterns.push({
            id: '',
            pattern: matches[0],
            riskLevel: risk,
            description: `Shell pattern in ${file.path}`,
          });
        }
      }
    }

    return patterns;
  }

  private async analyzeDependencies(
    files: Array<{ path: string; content: string }>
  ): Promise<Dependency[]> {
    const dependencies: Dependency[] = [];

    const packageJson = files.find((f) => f.path.endsWith('package.json'));
    if (packageJson) {
      try {
        const pkg = JSON.parse(packageJson.content);
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        for (const [name, version] of Object.entries(deps)) {
          dependencies.push({
            id: '',
            name,
            version: String(version),
            type: 'npm',
          });
        }
      } catch {
        // Invalid package.json
      }
    }

    return dependencies;
  }

  private detectSecretPatterns(
    files: Array<{ path: string; content: string }>
  ): boolean {
    const allContent = files.map((f) => f.content).join('\n');
    return SECRET_PATTERNS.some((p) => p.test(allContent));
  }
}

export const sbomGeneratorService = new SBOMGeneratorService();
