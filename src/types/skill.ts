export type SourceType = 'GIT' | 'ARCHIVE' | 'LOCAL';

export type SkillStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'DEPRECATED'
  | 'REVOKED';

export interface Skill {
  id: string;
  name: string;
  version: string;
  description?: string;
  contentHash: string;
  sourceType: SourceType;
  sourceUrl?: string;
  rawArtifactPath: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  status: SkillStatus;
  authorId?: string;
}

export interface SkillImportInput {
  gitUrl?: string;
  archivePath?: string;
  localPath?: string;
}

export interface SkillNormalized {
  skill: Skill;
  contentHash: string;
  files: SkillFile[];
}

export interface SkillFile {
  path: string;
  hash: string;
  size: number;
  type: string;
}

export interface SkillListItem extends Skill {
  riskScore?: number;
  riskLevel?: string;
  tags: string[];
  approvalStatus?: string;
  isVerified: boolean;
}
