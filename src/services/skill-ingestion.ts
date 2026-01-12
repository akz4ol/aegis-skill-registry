import simpleGit from 'simple-git';
import { computeFileHash } from '@/lib/hash';
import type { SkillImportInput, SourceType, SkillNormalized, SkillFile } from '@/types';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

interface IngestionResult {
  success: boolean;
  skill?: SkillNormalized;
  error?: string;
}

export class SkillIngestionService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(os.tmpdir(), 'aegis-skills');
  }

  async importSkill(input: SkillImportInput): Promise<IngestionResult> {
    try {
      const workDir = await this.createWorkDir();

      let sourceType: SourceType;
      let files: SkillFile[];

      if (input.gitUrl) {
        sourceType = 'GIT';
        files = await this.importFromGit(input.gitUrl, workDir);
      } else if (input.archivePath) {
        sourceType = 'ARCHIVE';
        files = await this.importFromArchive(input.archivePath, workDir);
      } else if (input.localPath) {
        sourceType = 'LOCAL';
        files = await this.importFromLocal(input.localPath, workDir);
      } else {
        return { success: false, error: 'No valid import source provided' };
      }

      const manifest = await this.detectSkillManifest(files);
      if (!manifest) {
        return { success: false, error: 'No valid skill manifest found' };
      }

      const contentHash = computeFileHash(
        files.map((f) => ({ path: f.path, content: f.hash }))
      );

      const normalized: SkillNormalized = {
        skill: {
          id: '',
          name: manifest.name,
          version: manifest.version,
          description: manifest.description,
          contentHash,
          sourceType,
          sourceUrl: input.gitUrl,
          rawArtifactPath: workDir,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'DRAFT',
        },
        contentHash,
        files,
      };

      return { success: true, skill: normalized };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async createWorkDir(): Promise<string> {
    const dir = path.join(this.tempDir, Date.now().toString());
    await fs.mkdir(dir, { recursive: true });
    return dir;
  }

  private async importFromGit(url: string, workDir: string): Promise<SkillFile[]> {
    const git = simpleGit();
    await git.clone(url, workDir, ['--depth', '1']);
    return this.scanDirectory(workDir);
  }

  private async importFromArchive(archivePath: string, _workDir: string): Promise<SkillFile[]> {
    // Archive extraction would be implemented here
    throw new Error(`Archive import not yet implemented: ${archivePath}`);
  }

  private async importFromLocal(localPath: string, _workDir: string): Promise<SkillFile[]> {
    return this.scanDirectory(localPath);
  }

  private async scanDirectory(dir: string): Promise<SkillFile[]> {
    const files: SkillFile[] = [];
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(dir, entry.name);
      const relativePath = entry.name;

      if (entry.isDirectory()) {
        const subFiles = await this.scanDirectory(fullPath);
        files.push(
          ...subFiles.map((f) => ({
            ...f,
            path: path.join(relativePath, f.path),
          }))
        );
      } else {
        const content = await fs.readFile(fullPath);
        const stat = await fs.stat(fullPath);
        files.push({
          path: relativePath,
          hash: content.toString('hex').slice(0, 64),
          size: stat.size,
          type: path.extname(entry.name).slice(1) || 'unknown',
        });
      }
    }

    return files;
  }

  private async detectSkillManifest(
    files: SkillFile[]
  ): Promise<{ name: string; version: string; description?: string } | null> {
    const manifestFiles = ['skill.json', 'skill.yaml', 'skill.yml', 'package.json'];
    const manifestFile = files.find((f) =>
      manifestFiles.includes(path.basename(f.path).toLowerCase())
    );

    if (!manifestFile) {
      return null;
    }

    // For demo purposes, return a basic manifest
    return {
      name: 'imported-skill',
      version: '1.0.0',
      description: 'Imported skill package',
    };
  }
}

export const skillIngestionService = new SkillIngestionService();
