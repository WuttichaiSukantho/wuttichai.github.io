import { makeAutoObservable } from 'mobx';

export type ThemeMode = 'light' | 'dark' | 'system';

export class ThemeStore {
  mode: ThemeMode = 'system';
  hydrated = false;

  #mediaQuery: MediaQueryList | null = null;

  readonly #handleSystemTheme = (): void => {
    if (this.mode === 'system') {
      this.#applyTheme();
    }
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  init() {
    if (globalThis.window === undefined || this.hydrated) return;

    const saved = globalThis.window.localStorage.getItem('theme-mode') as ThemeMode | null;

    if (saved) this.mode = saved;

    this.#applyTheme();
    this.#listenSystem();

    this.hydrated = true;
  }

  setMode(mode: ThemeMode) {
    this.mode = mode;

    globalThis.window.localStorage.setItem('theme-mode', mode);

    this.#applyTheme();
  }

  toggle() {
    if (this.mode === 'light') return this.setMode('dark');
    if (this.mode === 'dark') return this.setMode('system');

    this.setMode('light');
  }

  #getSystemTheme(): 'light' | 'dark' {
    return globalThis.window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  #applyTheme() {
    const root = document.documentElement;

    const theme = this.mode === 'system' ? this.#getSystemTheme() : this.mode;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }

  #listenSystem() {
    this.#mediaQuery = globalThis.window.matchMedia('(prefers-color-scheme: dark)');
    this.#mediaQuery.addEventListener('change', this.#handleSystemTheme);
  }

  dispose(): void {
    this.#mediaQuery?.removeEventListener('change', this.#handleSystemTheme);
    this.#mediaQuery = null;
    this.hydrated = false;
  }
}

export const themeStore = new ThemeStore();
