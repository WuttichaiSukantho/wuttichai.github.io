import { runInAction } from 'mobx';

import type { CharacterModel } from './model';

/* =========================================================
   CharacterProgression  (stateless — safe as singleton)
   - Handles EXP gain, levelling up, and stat scaling
========================================================= */

const BASE_EXP = 50;
const LEVEL_SCALE = 1.35;
const MIN_EXP_MULTIPLIER = 0.2;
const MAX_LEVEL_UPS_PER_KILL = 5; // prevent runaway level-up loops

const HP_PER_LEVEL = 30;
const DAMAGE_PER_LEVEL = 0.2;
const SPEED_PER_LEVEL = 0.015;
const MASS_PER_LEVEL = 0.8;
const HEAL_ON_KILL_RATIO = 0.25;

export class CharacterProgression {
  /* ─── EXP ─────────────────────────────────────────────── */

  gainExp(character: CharacterModel, amount: number): void {
    if (!character.isAlive || amount <= 0) return;

    runInAction(() => {
      let { exp, expToNext, level } = character;

      exp += amount;

      let loops = 0;
      while (exp >= expToNext && loops < MAX_LEVEL_UPS_PER_KILL) {
        exp -= expToNext;
        level++;
        expToNext = Math.trunc(expToNext * LEVEL_SCALE);
        loops++;
      }

      character.exp = exp;
      character.level = level;
      character.expToNext = expToNext;

      if (loops > 0) this.#applyLevelStats(character, loops);
    });
  }

  /* ─── Healing ─────────────────────────────────────────── */

  heal(character: CharacterModel, amount: number): void {
    if (!character.isAlive || amount <= 0) return;

    character.hp = Math.min(character.MAX_HP, character.hp + amount);
  }

  /* ─── Kill reward ─────────────────────────────────────── */

  onKill(killer: CharacterModel, victim: CharacterModel): void {
    if (!killer.isAlive) return;

    const levelDiff = victim.level - killer.level;
    const multiplier = Math.max(MIN_EXP_MULTIPLIER, Math.min(2, 1 + levelDiff * 0.25));

    const exp = Math.trunc(BASE_EXP * multiplier);

    this.gainExp(killer, exp);
    this.heal(killer, Math.trunc(killer.MAX_HP * HEAL_ON_KILL_RATIO));

    killer.speechSystem.setSpeech(`+${exp} EXP 🔥`);
  }

  /* ─── Private ─────────────────────────────────────────── */
  #applyLevelStats(character: CharacterModel, gains: number): void {
    character.MAX_HP += HP_PER_LEVEL * gains;

    character.baseDamageMultiplier += DAMAGE_PER_LEVEL * gains;

    character.speedMultiplier += SPEED_PER_LEVEL * gains;

    character.mass += MASS_PER_LEVEL * gains;

    character.hp = character.MAX_HP;

    character.speechSystem.setSpeech(`LEVEL UP! 🔥 Lv.${character.level}`);
  }
}

/* Stateless — one instance shared across all characters */
export const characterProgression = new CharacterProgression();
