import { FlowerModel } from './model';
import { SeedRandom } from './seed';

/* =========================================================
   Flower Store (Group Object)
========================================================= */

export class FlowerStore {
  readonly flowers: FlowerModel[] = [];

  constructor(count: number, seed = 2026) {
    const random = new SeedRandom(seed);

    for (let i = 0; i < count; i++) {
      this.flowers.push(new FlowerModel(i, random));
    }
  }
}
