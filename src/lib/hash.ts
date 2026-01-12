import CryptoJS from 'crypto-js';

export function computeContentHash(content: string | Buffer): string {
  const data = typeof content === 'string' ? content : content.toString('utf-8');
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

export function computeFileHash(files: Array<{ path: string; content: string }>): string {
  const sorted = [...files].sort((a, b) => a.path.localeCompare(b.path));
  const combined = sorted.map((f) => `${f.path}:${computeContentHash(f.content)}`).join('\n');
  return computeContentHash(combined);
}

export function verifyHash(content: string, expectedHash: string): boolean {
  const actualHash = computeContentHash(content);
  return actualHash === expectedHash;
}

export function generateSBOMHash(sbom: object): string {
  const normalized = JSON.stringify(sbom, Object.keys(sbom).sort());
  return computeContentHash(normalized);
}
