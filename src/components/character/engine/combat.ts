import { characterDeath } from './death';
import type { CharacterModel } from './model';

/* =========================================================
   CharacterCombat  (per-character — owns hit cooldown map)
   - Resolves damage on collision based on relative momentum
   - onEffect callback lets callers hook in visual effects
     without creating a hard dependency on the collision layer
========================================================= */

const HIT_COOLDOWN_MS = 200;
const MIN_DAMAGE = 1;
const MAX_DAMAGE = 40;
const IMPACT_SCALE = 3;

export type EffectCallback = (midX: number, midY: number) => void;

export class CharacterCombat {
  /** Last hit timestamp per target id (resets cooldown correctly per attacker) */
  readonly #lastHitMap = new Map<number, number>();

  /** Optional hook for spawning hit effects (e.g. particle sparks) */
  onEffect: EffectCallback | null = null;

  /* ─── Public ──────────────────────────────────────────── */

  resolve(a: CharacterModel, b: CharacterModel): void {
    const dx = b.x.get() - a.x.get();
    const dy = b.y.get() - a.y.get();

    const dist = Math.hypot(dx, dy);
    if (dist === 0) return;

    const nx = dx / dist;
    const ny = dy / dist;

    const rvx = a.vx - b.vx;
    const rvy = a.vy - b.vy;

    const impact = Math.abs(rvx * nx + rvy * ny);

    if (impact < 0.05) return;

    const speedA = Math.hypot(a.vx, a.vy);
    const speedB = Math.hypot(b.vx, b.vy);

    const aMomentum = a.mass * speedA;
    const bMomentum = b.mass * speedB;

    const damage = impact * IMPACT_SCALE;
    const now = Date.now();

    if (Math.abs(aMomentum - bMomentum) < 0.05) {
      this.#applyDamage(a, b, damage * 0.5, now);
      this.#applyDamage(b, a, damage * 0.5, now);
    } else {
      const attacker = aMomentum > bMomentum ? a : b;
      const target = attacker === a ? b : a;

      this.#applyDamage(attacker, target, damage * attacker.damageMultiplier, now);
    }

    if (this.onEffect) {
      const midX = (a.x.get() + b.x.get()) * 0.5;
      const midY = (a.y.get() + b.y.get()) * 0.5;
      this.onEffect(midX, midY);
    }
  }

  /* ─── Private ─────────────────────────────────────────── */

  #applyDamage(
    attacker: CharacterModel,
    target: CharacterModel,
    damage: number,
    now: number,
  ): boolean {
    const lastHit = this.#lastHitMap.get(target.id);
    if (lastHit !== undefined && now - lastHit < HIT_COOLDOWN_MS) {
      return false;
    }

    this.#lastHitMap.set(target.id, now);

    // ถ้า invincible → ไม่รับ damage เลย
    if (target.isInvincible) return false;

    const finalDamage = Math.min(MAX_DAMAGE, Math.max(MIN_DAMAGE, damage));
    target.hp = Math.max(0, target.hp - finalDamage);

    if (target.hp > 0) return false;

    characterDeath.trigger(target);
    attacker.rewardKill(target);
    return true;
  }
}
