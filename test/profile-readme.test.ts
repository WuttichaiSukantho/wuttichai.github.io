import { ProfileReadmeSection } from '@components/section/profile-readme-section';
import { languageStore } from '@store/language-store';
import { expect, test } from 'bun:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

test('profile source, timeline and Mermaid links render in both languages', () => {
  const previous = languageStore.language;
  try {
    for (const language of ['en', 'th'] as const) {
      languageStore.setLanguage(language);
      const html = renderToStaticMarkup(createElement(ProfileReadmeSection));
      expect(html).toContain(language === 'en' ? 'Engineering profile' : 'โปรไฟล์ด้านวิศวกรรม');
      expect(html).toContain(language === 'en' ? 'May 2024' : 'พ.ค. 2024');
      expect(html).toContain('Stream South Technology');
      expect(html).toContain('WuttichaiSukantho / README');
      expect(html).toContain('/wuttichai.github.io/profile/architecture.svg');
      expect(html).toContain('/wuttichai.github.io/profile/architecture.mmd');
    }
  } finally {
    languageStore.setLanguage(previous);
  }
});
