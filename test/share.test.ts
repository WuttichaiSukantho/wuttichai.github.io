import { copyShareUrl, getShareUrl, SHARE_TEXT, SHARE_TITLE, SHARE_URL } from '@lib/share';
import { describe, expect, test } from 'bun:test';

describe('share utilities', () => {
  test('exposes the configured share metadata', () => {
    expect(SHARE_URL).toContain('wuttichaisukantho.github.io/wuttichai.github.io');
    expect(SHARE_TITLE).toContain('Wuttichai');
    expect(SHARE_TEXT).toContain('projects');
  });

  test('falls back to the canonical URL outside a browser', () => {
    expect(getShareUrl()).toBe(SHARE_URL);
  });

  test('returns false when clipboard access is unavailable', async () => {
    expect(await copyShareUrl(SHARE_URL)).toBe(false);
  });

  test('reads the browser URL and handles clipboard success and failure', async () => {
    const writes: string[] = [];
    Object.defineProperty(globalThis, 'window', {
      configurable: true,
      value: { location: { href: 'https://example.com/current' } },
    });
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { writeText: async (url: string) => writes.push(url) } },
    });

    expect(getShareUrl()).toBe('https://example.com/current');
    expect(await copyShareUrl(SHARE_URL)).toBe(true);
    expect(writes).toEqual([SHARE_URL]);

    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { clipboard: { writeText: async () => Promise.reject(new Error('denied')) } },
    });
    expect(await copyShareUrl(SHARE_URL)).toBe(false);
    delete (globalThis as { window?: unknown }).window;
    delete (globalThis as { navigator?: unknown }).navigator;
  });
});
