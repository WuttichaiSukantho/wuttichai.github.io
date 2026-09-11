import { type Language, type TranslationKey, translations } from '@domain/i18n/translations';
import { makeAutoObservable } from 'mobx';

const STORAGE_KEY = 'portfolio-language';

const detectLanguage = (): Language => {
  if (typeof navigator === 'undefined') return 'en';

  const browserLanguages =
    navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  return browserLanguages.some((language) => language.toLowerCase().startsWith('th')) ? 'th' : 'en';
};

const parseLanguage = (value: string | null): Language | null =>
  value === 'en' || value === 'th' ? value : null;

export class LanguageStore {
  language: Language = 'en';
  hydrated = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  init(): void {
    if (globalThis.window === undefined || this.hydrated) return;

    this.language =
      parseLanguage(globalThis.window.localStorage.getItem(STORAGE_KEY)) ?? detectLanguage();
    this.hydrated = true;
    this.applyDocumentLanguage();
  }

  setLanguage(language: Language): void {
    this.language = language;
    if (globalThis.window !== undefined) {
      globalThis.window.localStorage.setItem(STORAGE_KEY, language);
      this.applyDocumentLanguage();
    }
  }

  t(key: TranslationKey): string {
    return translations[this.language][key] ?? translations.en[key];
  }

  private applyDocumentLanguage(): void {
    document.documentElement.lang = this.language;
  }
}

export const languageStore = new LanguageStore();
