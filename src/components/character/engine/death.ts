import type { CharacterModel } from './model';
import { characterRegistry } from './registry';

/* =========================================================
   CharacterDeath  (stateless — safe as singleton)
   - Triggers death sequence + explosion shockwave
========================================================= */

const EXPLOSION_RADIUS = 260;
const EXPLOSION_RADIUS_SQ = EXPLOSION_RADIUS * EXPLOSION_RADIUS;
const EXPLOSION_BASE_FORCE = 55;
const EXPLOSION_MAX_IMPULSE = 120;

export class CharacterDeath {
  /* ─── Trigger ─────────────────────────────────────────── */

  trigger(character: CharacterModel): void {
    if (character.isDying || character.dead) return;

    character.isDying = true;
    character.hp = 0;
    character.showCombo = true;

    const x = character.x.get();
    const y = character.y.get();

    character.deathX.set(x);
    character.deathY.set(y);

    this.#explode(character, x, y);
    character.setVelocity(0, 0);
  }

  finalize(character: CharacterModel): void {
    character.dead = true;
  }

  revive(character: CharacterModel): void {
    if (!character.dead && !character.isDying) return;

    character.dead = false;
    character.isDying = false;
    character.hp = character.MAX_HP;
  }

  /* ─── Explosion shockwave ─────────────────────────────── */

  #explode(source: CharacterModel, cx: number, cy: number): void {
    for (const other of characterRegistry.characters) {
      if (other === source || !other.isAlive) continue;

      const dx = other.x.get() - cx;
      const dy = other.y.get() - cy;
      const distSq = dx * dx + dy * dy;

      if (distSq > EXPLOSION_RADIUS_SQ) continue;

      const dist = Math.sqrt(distSq) || 0.0001;
      const nx = dx / dist;
      const ny = dy / dist;

      // Quadratic falloff: closer = stronger
      const falloff = 1 - dist / EXPLOSION_RADIUS;
      const force = EXPLOSION_BASE_FORCE * falloff * falloff;
      const impulse = Math.min(force / (other.mass || 1), EXPLOSION_MAX_IMPULSE);

      other.vx += nx * impulse;
      other.vy += ny * impulse;
    }
  }
}

/* Stateless — one instance shared across all characters */
export const characterDeath = new CharacterDeath();
