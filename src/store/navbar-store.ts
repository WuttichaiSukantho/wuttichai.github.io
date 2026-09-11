import type { TranslationKey } from '@domain/i18n/translations';
import { action, makeAutoObservable } from 'mobx';
import type { ComponentType } from 'react';

export interface NavItem {
  id: string;
  labelKey: TranslationKey;
  icon: ComponentType;
}

const SCROLL_LOCK_MS = 650;

class NavbarStore {
  /* ==============================
     STATE
  ============================== */

  isOpen = false;
  activeId = 'home';

  navItems: NavItem[] = [
    { id: 'home', labelKey: 'nav.home', icon: () => null },
    { id: 'playground', labelKey: 'nav.playground', icon: () => null },
    { id: 'about-hero', labelKey: 'nav.about', icon: () => null },
    { id: 'about-story', labelKey: 'nav.story', icon: () => null },
    { id: 'experience', labelKey: 'nav.experience', icon: () => null },
    { id: 'tech-stack', labelKey: 'nav.techStack', icon: () => null },
    { id: 'education', labelKey: 'nav.education', icon: () => null },
    { id: 'contact', labelKey: 'nav.contact', icon: () => null },
  ];

  #sectionIds: string[] = [];
  #currentIndex = 0;
  #isScrolling = false;

  #observer?: IntersectionObserver;
  #scrollTimeout?: number;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /* ==============================
     UI
  ============================== */

  setOpen(v: boolean) {
    this.isOpen = v;
  }

  setActive(id: string) {
    const index = this.#sectionIds.indexOf(id);

    if (index === -1) return;

    this.activeId = id;
    this.#currentIndex = index;
  }

  /* ==============================
     INIT
  ============================== */

  registerSections(ids: readonly string[]) {
    this.destroy();

    this.#sectionIds = [...ids];

    const activeIndex = this.#sectionIds.indexOf(this.activeId);

    this.#currentIndex = Math.max(activeIndex, 0);

    const currentId = this.#sectionIds[this.#currentIndex];

    if (currentId) {
      this.activeId = currentId;
    }

    this.#setupObserver();
    globalThis.window.addEventListener('keydown', this.#handleKey);
  }

  destroy() {
    globalThis.window.removeEventListener('keydown', this.#handleKey);

    this.#observer?.disconnect();

    if (this.#scrollTimeout !== undefined) {
      globalThis.window.clearTimeout(this.#scrollTimeout);
    }

    this.#isScrolling = false;
  }

  /* ==============================
     OBSERVER
  ============================== */

  #setupObserver() {
    this.#observer?.disconnect();

    const observer = new IntersectionObserver(
      (entries) => {
        if (this.#isScrolling) return;

        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visibleEntry) return;

        const id = visibleEntry.target.id;
        const index = this.#sectionIds.indexOf(id);

        if (index === -1) return;

        action(() => {
          if (this.#isScrolling) return;

          this.activeId = id;
          this.#currentIndex = index;
        })();
      },
      {
        threshold: 0.55,
      },
    );

    this.#observer = observer;

    for (const id of this.#sectionIds) {
      const element = document.getElementById(id);

      if (element) {
        observer.observe(element);
      }
    }
  }

  /* ==============================
     SCROLL ENGINE
  ============================== */

  #scrollToIndex(index: number) {
    if (this.#isScrolling) return;
    if (index < 0 || index >= this.#sectionIds.length) return;

    const id = this.#sectionIds[index];

    if (!id) return;

    const element = document.getElementById(id);

    if (!element) return;

    this.#isScrolling = true;
    this.#currentIndex = index;
    this.activeId = id;

    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 0;
    const targetTop = Math.max(
      0,
      globalThis.window.scrollY + element.getBoundingClientRect().top - headerHeight - 12,
    );

    const behavior = globalThis.window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth';

    globalThis.window.scrollTo({
      top: targetTop,
      behavior,
    });

    if (this.#scrollTimeout !== undefined) {
      globalThis.window.clearTimeout(this.#scrollTimeout);
    }

    this.#scrollTimeout = globalThis.window.setTimeout(
      action(() => {
        this.#isScrolling = false;
      }),
      SCROLL_LOCK_MS,
    );
  }

  /* ==============================\n     KEYBOARD
  ============================== */

  readonly #handleKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') {
      return;
    }

    e.preventDefault();

    action(() => {
      if (this.#isScrolling) return;

      if (e.key === 'ArrowDown') {
        this.#scrollToIndex(this.#currentIndex + 1);
      } else {
        this.#scrollToIndex(this.#currentIndex - 1);
      }
    })();
  };

  /* ==============================
     NAV CLICK
  ============================== */

  scrollTo(id: string) {
    if (this.activeId === id) {
      this.isOpen = false;
      return;
    }

    const index = this.#sectionIds.indexOf(id);

    if (index === -1) return;

    this.#scrollToIndex(index);
    this.isOpen = false;
  }
}

export const navbarStore = new NavbarStore();
