import { siteConfig } from '@domain/site/site-config';

export const SHARE_URL = `${siteConfig.url}/`;
export const SHARE_TITLE = `${siteConfig.name} (${siteConfig.nickname}) | ${siteConfig.jobTitle}`;
export const SHARE_TEXT = 'Explore my projects, experience and software engineering work.';

export function getShareUrl(): string {
  return globalThis.window?.location.href ? globalThis.window.location.href : SHARE_URL;
}

export async function copyShareUrl(url: string): Promise<boolean> {
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) return false;

  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
