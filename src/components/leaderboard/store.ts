import type { CharacterModel } from '@components/character/engine/model';
import { characterRegistry } from '@components/character/engine/registry';
import { makeAutoObservable } from 'mobx';

class LeaderboardStore {
  constructor() {
    makeAutoObservable(this);
  }

  get characters(): CharacterModel[] {
    return characterRegistry.characters;
  }

  get ranking(): CharacterModel[] {
    return [...this.characters].sort((a, b) => {
      // priority: level → hp → exp

      if (b.level !== a.level) return b.level - a.level;

      if (b.hp !== a.hp) return b.hp - a.hp;

      return b.exp - a.exp;
    });
  }
}

export const leaderboardStore = new LeaderboardStore();
