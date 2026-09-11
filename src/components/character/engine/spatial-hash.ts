import type { CharacterModel } from './model';

export class SpatialHash {
  readonly #cellSize: number;
  readonly #grid = new Map<number, CharacterModel[]>();

  readonly #queryBuffer: CharacterModel[] = [];

  constructor(cellSize: number) {
    this.#cellSize = cellSize;
  }

  clear(): void {
    for (const bucket of this.#grid.values()) {
      bucket.length = 0;
    }
  }

  insert(c: CharacterModel): void {
    const cx = Math.trunc(c.x.get() / this.#cellSize);
    const cy = Math.trunc(c.y.get() / this.#cellSize);

    const key = (cx << 16) ^ cy;

    let bucket = this.#grid.get(key);

    if (!bucket) {
      bucket = [];
      this.#grid.set(key, bucket);
    }

    bucket.push(c);
  }

  query(x: number, y: number): CharacterModel[] {
    const results = this.#queryBuffer;
    results.length = 0;

    const cx = Math.trunc(x / this.#cellSize);
    const cy = Math.trunc(y / this.#cellSize);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = ((cx + dx) << 16) ^ (cy + dy);

        const bucket = this.#grid.get(key);

        if (!bucket) continue;

        for (const element of bucket) {
          if (!element) continue;
          results.push(element);
        }
      }
    }

    return results;
  }
}
