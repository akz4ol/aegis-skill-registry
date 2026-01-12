export type ProvenanceEvent =
  | 'IMPORTED'
  | 'ANALYZED'
  | 'POLICY_EVALUATED'
  | 'APPROVAL_REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'SIGNED'
  | 'INSTALLED'
  | 'EXECUTED'
  | 'REVOKED';

export interface ProvenanceEntry {
  id: string;
  skillId: string;
  eventType: ProvenanceEvent;
  metadata: Record<string, unknown>;
  createdAt: Date;
  actorId?: string;
}

export interface SkillSignature {
  id: string;
  skillId: string;
  signatureHash: string;
  algorithm: 'ED25519' | 'RSA-SHA256' | 'ECDSA-P256';
  publicKeyId: string;
  signedAt: Date;
  signedById: string;
  verified: boolean;
  verifiedAt?: Date;
}

export interface SigningKeyPair {
  id: string;
  publicKey: string;
  privateKeyEncrypted?: string;
  algorithm: string;
  createdAt: Date;
  expiresAt?: Date;
  revoked: boolean;
}

export interface ProvenanceChain {
  skillId: string;
  skillName: string;
  version: string;
  entries: ProvenanceEntry[];
  signatures: SkillSignature[];
  isComplete: boolean;
  integrityHash: string;
}

export interface AuditTrailExport {
  format: 'JSON' | 'CSV' | 'PDF';
  skillId?: string;
  startDate: Date;
  endDate: Date;
  entries: ProvenanceEntry[];
  exportedAt: Date;
  exportedBy: string;
}
