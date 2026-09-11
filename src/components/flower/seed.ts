/* =========================================================
   Seed Random (Deterministic)
========================================================= */

export class SeedRandom {
  #seed: number;

  constructor(seed: number) {
    this.#seed = seed;
  }

  next(): number {
    this.#seed = (this.#seed * 16807) % 2147483647;
    return (this.#seed - 1) / 2147483646;
  }
}
