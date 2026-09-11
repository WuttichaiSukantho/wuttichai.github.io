import { makeAutoObservable } from 'mobx';

export interface CollisionEffectEntity {
  id: number;
  x: number;
  y: number;
}

const EFFECT_COOLDOWN = 1000;
const MAX_EFFECT = 1;

class CollisionRegistry {
  effects: CollisionEffectEntity[] = [];

  readonly #activePairs = new Set<string>();
  readonly #lastEffectMap = new Map<string, number>();
  #idCounter = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /* =========================
       Spawn (Limited + O(1))
    ========================= */

  spawn(x: number, y: number) {
    // ถ้าเกิน limit ลบตัวแรกออก (FIFO)
    if (this.effects.length >= MAX_EFFECT) {
      this.effects.shift();
    }

    this.effects.push({
      id: this.#idCounter++,
      x,
      y,
    });
  }

  /* =========================
       O(1) Remove (Swap + Pop)
    ========================= */

  remove(id: number) {
    const index = this.effects.findIndex((e) => e.id === id);
    if (index === -1) return;

    const lastIndex = this.effects.length - 1;

    if (index !== lastIndex) {
      const last = this.effects[lastIndex];
      if (!last) return;
      this.effects[index] = last;
    }

    this.effects.pop();
  }

  /* =========================
       Pair Utility
    ========================= */

  #getKey(a: number, b: number) {
    return a < b ? `${a}-${b}` : `${b}-${a}`;
  }

  isActive(a: number, b: number) {
    return this.#activePairs.has(this.#getKey(a, b));
  }

  activate(a: number, b: number) {
    this.#activePairs.add(this.#getKey(a, b));
  }

  deactivate(a: number, b: number) {
    this.#activePairs.delete(this.#getKey(a, b));
  }

  /* =========================
       Cooldown
    ========================= */

  canSpawnEffect(a: number, b: number): boolean {
    const key = this.#getKey(a, b);
    const now = Date.now();
    const last = this.#lastEffectMap.get(key);

    if (last !== undefined && now - last < EFFECT_COOLDOWN) {
      return false;
    }

    this.#lastEffectMap.set(key, now);
    return true;
  }
}

export const collisionRegistry = new CollisionRegistry();
