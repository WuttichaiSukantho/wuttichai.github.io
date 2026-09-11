export class Viewport {
  width = 0;
  height = 0;
  scrollX = 0;
  scrollY = 0;

  #stage: HTMLElement | null = null;
  #resizeObserver: ResizeObserver | null = null;

  init(): void {
    if (globalThis.window === undefined) return;

    this.width = globalThis.window.innerWidth;
    this.height = globalThis.window.innerHeight;
    this.scrollX = globalThis.window.scrollX;
    this.scrollY = globalThis.window.scrollY;

    globalThis.window.addEventListener(
      'resize',
      () => {
        if (this.#stage) return;

        this.width = globalThis.window.innerWidth;
        this.height = globalThis.window.innerHeight;
      },
      { passive: true },
    );

    globalThis.window.addEventListener(
      'scroll',
      () => {
        if (this.#stage) return;

        this.scrollX = globalThis.window.scrollX;
        this.scrollY = globalThis.window.scrollY;
      },
      { passive: true },
    );
  }

  setStage(stage: HTMLElement): void {
    this.#stage = stage;
    this.#resizeObserver?.disconnect();

    this.#resizeObserver = new ResizeObserver(() => this.updateStageBounds());
    this.#resizeObserver.observe(stage);
    this.updateStageBounds();
  }

  clearStage(): void {
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = null;
    this.#stage = null;
    this.width = globalThis.window.innerWidth;
    this.height = globalThis.window.innerHeight;
    this.scrollX = globalThis.window.scrollX;
    this.scrollY = globalThis.window.scrollY;
  }

  private updateStageBounds(): void {
    if (!this.#stage) return;

    const width = this.#stage.clientWidth;
    const height = this.#stage.clientHeight;

    if (width === this.width && height === this.height) return;

    this.width = width;
    this.height = height;
    this.scrollX = 0;
    this.scrollY = 0;
  }
}

export const viewport = new Viewport();

if (globalThis.window !== undefined) {
  viewport.init();
}
