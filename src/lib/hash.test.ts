import { describe, it, expect } from 'vitest';
import { computeContentHash, computeFileHash, verifyHash } from './hash';

describe('Hash utilities', () => {
  describe('computeContentHash', () => {
    it('should generate consistent hash for same content', () => {
      const content = 'Hello, World!';
      const hash1 = computeContentHash(content);
      const hash2 = computeContentHash(content);
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different content', () => {
      const hash1 = computeContentHash('content1');
      const hash2 = computeContentHash('content2');
      expect(hash1).not.toBe(hash2);
    });

    it('should return a 64-character hex string', () => {
      const hash = computeContentHash('test');
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('computeFileHash', () => {
    it('should generate hash from multiple files', () => {
      const files = [
        { path: 'file1.ts', content: 'content1' },
        { path: 'file2.ts', content: 'content2' },
      ];
      const hash = computeFileHash(files);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should be order-independent (sorted by path)', () => {
      const files1 = [
        { path: 'a.ts', content: 'a' },
        { path: 'b.ts', content: 'b' },
      ];
      const files2 = [
        { path: 'b.ts', content: 'b' },
        { path: 'a.ts', content: 'a' },
      ];
      const hash1 = computeFileHash(files1);
      const hash2 = computeFileHash(files2);
      expect(hash1).toBe(hash2);
    });
  });

  describe('verifyHash', () => {
    it('should return true for matching hash', () => {
      const content = 'test content';
      const hash = computeContentHash(content);
      expect(verifyHash(content, hash)).toBe(true);
    });

    it('should return false for non-matching hash', () => {
      const content = 'test content';
      const wrongHash = 'wrong_hash';
      expect(verifyHash(content, wrongHash)).toBe(false);
    });
  });
});
