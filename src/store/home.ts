import { makeAutoObservable } from 'mobx';

export type AutoSpeed = 0 | 1 | 2 | 3;

class CharacterEntity {
  constructor(public readonly id: number) {}
}

const BASE_AUTO_INTERVAL = 1200;
const MAX_CHARACTERS = 24;

export class HomeStore {
  characters: CharacterEntity[] = [new CharacterEntity(1)];
  autoSpeed: AutoSpeed = 0;
  resetVersion = 0;

  #timer: ReturnType<typeof setInterval> | null = null;
  #nextId = 1;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    // ❌ DO NOT load localStorage here.
    //
    // this.#loadState();
  }

  get count(): number {
    return this.characters.length;
  }

  get canAdd(): boolean {
    return this.count < MAX_CHARACTERS;
  }

  #isStorageAvailable(): boolean {
    return globalThis.window?.localStorage.getItem('cookie-consent') === 'accepted';
  }

  #loadState(): void {
    if (!this.#isStorageAvailable()) return;

    const savedCount = globalThis.window.localStorage.getItem('bunny-count');

    if (!savedCount) return;

    const count = Number.parseInt(savedCount, 10);

    if (!Number.isInteger(count) || count <= 0) return;

    this.characters = Array.from({ length: count }, (_, index) => new CharacterEntity(index + 1));

    this.#nextId = count;
  }

  /*
   * Call this only after the component has mounted.
   * This prevents SSR hydration mismatch.
   */
  hydrate(): void {
    this.#loadState();
  }

  #saveState(): void {
    if (!this.#isStorageAvailable()) return;

    globalThis.window.localStorage.setItem('bunny-count', String(this.count));
  }

  add(): void {
    if (!this.canAdd) return;

    const id = ++this.#nextId;

    this.characters.push(new CharacterEntity(id));

    this.#saveState();
  }

  remove(): void {
    if (this.characters.length === 0) return;

    this.characters.pop();

    this.#saveState();
  }

  removeById(id: number): void {
    const index = this.characters.findIndex((character) => character.id === id);

    if (index === -1) return;

    this.characters.splice(index, 1);

    this.#saveState();
  }

  setAuto(speed: AutoSpeed): void {
    if (speed === this.autoSpeed) {
      this.stopAuto();
      return;
    }

    this.stopAuto();

    if (speed === 0) return;

    this.autoSpeed = speed;

    const interval = BASE_AUTO_INTERVAL / speed;

    this.#timer = setInterval(this.add, interval);
  }

  stopAuto(): void {
    if (this.#timer !== null) {
      clearInterval(this.#timer);
      this.#timer = null;
    }

    this.autoSpeed = 0;
  }

  reset(): void {
    this.stopAuto();
    this.characters = [new CharacterEntity(1)];
    this.#nextId = 1;
    this.resetVersion++;
    this.#saveState();
  }

  dispose(): void {
    this.stopAuto();
  }
}

export const homeStore = new HomeStore();
