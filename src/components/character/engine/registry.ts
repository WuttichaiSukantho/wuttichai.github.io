import { makeAutoObservable } from 'mobx';

import type { CharacterModel } from './model';

/* =========================================================
   CharacterRegistry
   - Single source of truth for all active characters
   - Observable so UI/systems can react to character list
========================================================= */

export class CharacterRegistry {
  characters: CharacterModel[] = [];

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  add(character: CharacterModel): void {
    this.characters.push(character);
  }

  remove(character: CharacterModel): void {
    const index = this.characters.indexOf(character);
    if (index !== -1) this.characters.splice(index, 1);
  }

  clear(): void {
    this.characters.length = 0;
  }

  get count(): number {
    return this.characters.length;
  }

  get alive(): CharacterModel[] {
    return this.characters.filter((c) => c.isAlive);
  }
}

export const characterRegistry = new CharacterRegistry();
