import { makeAutoObservable, runInAction } from 'mobx';

import { viewport } from '../character/engine/viewport';

import { ItemModel, type ItemType } from './model';

/* =========================================================
   Constants
========================================================= */

const ITEM_TYPES: ItemType[] = [
  'speed',
  'invincible',
  'heal',
  'megaHeal',
  'damage',
  'shield',
  'slow',
  'haste',
  'regen',
  'berserk',
  'blink',
  'magnet',
];

const SPAWN_INTERVAL_MIN = 4000;
const SPAWN_INTERVAL_MAX = 9000;

const MAX_ITEMS_ON_FIELD = 5;
const ITEM_LIFETIME_MS = 12000;

const SPAWN_BATCH_MIN = 5;
const SPAWN_BATCH_MAX = 30;

const ITEM_RADIUS = 40;
const ITEM_MIN_DIST_SQ = (ITEM_RADIUS * 2) ** 2;
const MAX_SPAWN_ATTEMPTS = 10;

/* =========================================================
   Random
========================================================= */

/**
 * Non-cryptographic pseudo-random number generator.
 *
 * This is intentionally used only for gameplay randomness.
 * It must never be used for security-sensitive operations.
 */
const createRandom = (seed: number): (() => number) => {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;

    let value = state;

    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

/* =========================================================
   ItemRegistry
========================================================= */

export class ItemRegistry {
  items: ItemModel[] = [];

  #timerId: ReturnType<typeof setTimeout> | null = null;
  #running = false;

  /**
   * Gameplay-only PRNG.
   */
  readonly #random = createRandom(Date.now());

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get activeCount(): number {
    return this.items.reduce((count, item) => count + (item.collected ? 0 : 1), 0);
  }

  /* ───────────────── Lifecycle ───────────────── */

  start(): void {
    if (this.#running) return;

    this.#running = true;
    this.#scheduleNext();
  }

  stop(): void {
    this.#running = false;

    if (this.#timerId !== null) {
      clearTimeout(this.#timerId);
      this.#timerId = null;
    }
  }

  /* ───────────────── Pickup ───────────────── */

  tryPickup(characterX: number, characterY: number, radius: number): ItemModel | null {
    const radiusSquared = radius * radius;

    for (const item of this.items) {
      if (item.collected) continue;

      const dx = item.x.get() - characterX;
      const dy = item.y.get() - characterY;

      if (dx * dx + dy * dy <= radiusSquared) {
        runInAction(() => {
          item.collect();
        });

        return item;
      }
    }

    return null;
  }

  removeCollected(): void {
    for (let index = this.items.length - 1; index >= 0; index--) {
      const item = this.items[index];

      if (item?.collected) {
        this.items.splice(index, 1);
      }
    }
  }

  /* ───────────────── Spawn Scheduler ───────────────── */

  #scheduleNext(): void {
    if (!this.#running) return;

    const delay = SPAWN_INTERVAL_MIN + this.#random() * (SPAWN_INTERVAL_MAX - SPAWN_INTERVAL_MIN);

    this.#timerId = setTimeout(() => {
      const batch =
        SPAWN_BATCH_MIN + Math.floor(this.#random() * (SPAWN_BATCH_MAX - SPAWN_BATCH_MIN + 1));

      this.#spawnBatch(batch);
      this.#scheduleNext();
    }, delay);
  }

  /* ───────────────── Spawn Logic ───────────────── */

  #spawnBatch(count: number): void {
    for (let index = 0; index < count; index++) {
      if (this.items.length >= MAX_ITEMS_ON_FIELD) {
        break;
      }

      this.#spawnRandom();
    }
  }

  #spawnRandom(): void {
    if (this.items.length >= MAX_ITEMS_ON_FIELD) return;

    let x = 0;
    let y = 0;
    let found = false;

    for (let attempt = 0; attempt < MAX_SPAWN_ATTEMPTS; attempt++) {
      const availableWidth = Math.max(viewport.width - ITEM_RADIUS * 2, 0);
      const availableHeight = Math.max(viewport.height - ITEM_RADIUS * 2, 0);

      x = ITEM_RADIUS + this.#random() * availableWidth;
      y = ITEM_RADIUS + this.#random() * availableHeight;

      if (this.#isPositionFree(x, y)) {
        found = true;
        break;
      }
    }

    if (!found) return;

    const typeIndex = Math.floor(this.#random() * ITEM_TYPES.length);

    const type = ITEM_TYPES[typeIndex];

    if (type === undefined) return;

    const item = new ItemModel(type, x, y);

    runInAction(() => {
      this.items.push(item);
    });

    this.#scheduleExpire(item);
  }

  /* ───────────────── Expire ───────────────── */

  #scheduleExpire(item: ItemModel): void {
    setTimeout(() => {
      runInAction(() => {
        if (!item.collected) {
          item.collect();
        }

        this.removeCollected();
      });
    }, ITEM_LIFETIME_MS);
  }

  /* ───────────────── Utils ───────────────── */

  #isPositionFree(x: number, y: number): boolean {
    for (const item of this.items) {
      if (item.collected) continue;

      const dx = item.x.get() - x;
      const dy = item.y.get() - y;

      if (dx * dx + dy * dy < ITEM_MIN_DIST_SQ) {
        return false;
      }
    }

    return true;
  }
}

export const itemRegistry = new ItemRegistry();
