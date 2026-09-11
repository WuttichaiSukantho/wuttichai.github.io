import type { ItemModel } from '@components/item/model';
import { itemRegistry } from '@components/item/registry';
import { secureRandom } from '@lib/random';

import type { CharacterModel } from './model';
import { characterRegistry } from './registry';
import { viewport } from './viewport';

/* =========================================================
   CharacterAI
   Behaviour priority: Flee → SeekItem → SeekEnemy → Wander
========================================================= */

const CHASE_FORCE = 1.8;
const FLEE_FORCE = 2;
const ITEM_SEEK_FORCE = 1.6;
const SEPARATION_FORCE = 0.15;
const WANDER_FORCE = 0.15;
const WALL_STEER_FORCE = 0.45;
const WANDER_INTERVAL = 60;

const MAX_CHASE_RANGE_SQ = 800 * 800;
const ITEM_DETECT_RANGE_SQ = 420 * 420;
const SEPARATION_RANGE_SQ = 32 * 32;

const FLEE_HP_THRESHOLD = 0.25;

export class CharacterAI {
  private wanderAngle = secureRandom() * Math.PI * 2;
  private wanderTick = 0;

  constructor(private readonly model: CharacterModel) {}

  /* ─── Main tick ───────────────────────────────────────── */

  update(): void {
    this.applyBoundarySteering();

    const nearestEnemy = this.findNearestEnemy();

    if (this.shouldFlee(nearestEnemy)) {
      this.flee(nearestEnemy);
      return;
    }

    const bestItem = this.findBestItem();

    if (bestItem) {
      this.seekItem(bestItem);
      return;
    }

    if (nearestEnemy && this.seekEnemy(nearestEnemy)) {
      return;
    }

    this.wander();
  }

  /* ─── Flee ────────────────────────────────────────────── */

  flee(nearest: CharacterModel | null): void {
    if (!nearest) {
      return;
    }

    const myHp = this.model.hp / this.model.MAX_HP;
    const enemyHp = nearest.hp / nearest.MAX_HP;

    if (enemyHp < myHp) {
      this.seekEnemy(nearest);
      return;
    }

    const dx = this.model.x.get() - nearest.x.get();
    const dy = this.model.y.get() - nearest.y.get();
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      return;
    }

    this.model.vx += (dx / dist) * FLEE_FORCE;
    this.model.vy += (dy / dist) * FLEE_FORCE;
  }

  /* ─── Seek nearest item ───────────────────────────────── */

  seekItem(item: ItemModel): void {
    if (!item) {
      return;
    }

    const dx = item.x.get() - this.model.x.get();
    const dy = item.y.get() - this.model.y.get();
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      return;
    }

    const invDist = 1 / dist;

    this.model.vx += dx * invDist * ITEM_SEEK_FORCE;
    this.model.vy += dy * invDist * ITEM_SEEK_FORCE;
  }

  /* ─── Seek nearest enemy ──────────────────────────────── */

  seekEnemy(nearest: CharacterModel): boolean {
    if (!nearest) {
      return false;
    }

    const dx = nearest.x.get() - this.model.x.get();
    const dy = nearest.y.get() - this.model.y.get();
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
      return true;
    }

    const invDist = 1 / dist;

    this.model.vx += dx * invDist * CHASE_FORCE;
    this.model.vy += dy * invDist * CHASE_FORCE;

    this.applySeparation();

    return true;
  }

  /* ─── Wander ──────────────────────────────────────────── */

  wander(): void {
    this.wanderTick++;

    if (this.wanderTick >= WANDER_INTERVAL) {
      this.wanderTick = 0;

      this.wanderAngle += (secureRandom() - 0.5) * Math.PI * 0.8;
    }

    this.model.vx += Math.cos(this.wanderAngle) * WANDER_FORCE;

    this.model.vy += Math.sin(this.wanderAngle) * WANDER_FORCE;
  }

  /* ─── Helpers ─────────────────────────────────────────── */

  private shouldFlee(nearest: CharacterModel | null): boolean {
    if (!nearest) {
      return false;
    }

    const myHpRatio = this.model.hp / this.model.MAX_HP;

    const enemyHpRatio = nearest.hp / nearest.MAX_HP;

    return myHpRatio < FLEE_HP_THRESHOLD && enemyHpRatio > myHpRatio;
  }

  private findBestItem(): ItemModel | null {
    const myX = this.model.x.get();
    const myY = this.model.y.get();

    const { items } = itemRegistry;

    const healthRatio = this.model.hp / this.model.MAX_HP;
    let best: ItemModel | null = null;
    let bestScore = 0;

    for (const item of items) {
      if (item.collected) {
        continue;
      }

      const dx = item.x.get() - myX;
      const dy = item.y.get() - myY;
      const distSq = dx * dx + dy * dy;

      if (distSq >= ITEM_DETECT_RANGE_SQ) continue;

      const distanceScore = 1 - distSq / ITEM_DETECT_RANGE_SQ;
      const valueScore = this.getItemValue(item, healthRatio);
      const score = distanceScore + valueScore;

      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    }

    return best;
  }

  private getItemValue(item: ItemModel, healthRatio: number): number {
    switch (item.type) {
      case 'megaHeal':
        return healthRatio < 0.8 ? 2.4 : 0.15;
      case 'heal':
        return healthRatio < 0.65 ? 1.8 : 0;
      case 'regen':
        return healthRatio < 0.75 ? 1.1 : 0.1;
      case 'shield':
      case 'invincible':
        return healthRatio < 0.55 ? 1.2 : 0.3;
      case 'haste':
      case 'speed':
        return 0.75;
      case 'damage':
      case 'berserk':
        return 0.9;
      default:
        return 0.35;
    }
  }

  private applyBoundarySteering(): void {
    const margin = 112;
    const x = this.model.x.get();
    const y = this.model.y.get();

    if (x < margin) this.model.vx += WALL_STEER_FORCE;
    if (x > viewport.width - margin) this.model.vx -= WALL_STEER_FORCE;
    if (y < margin) this.model.vy += WALL_STEER_FORCE;
    if (y > viewport.height - margin) this.model.vy -= WALL_STEER_FORCE;
  }

  private findNearestEnemy(): CharacterModel | null {
    const myX = this.model.x.get();
    const myY = this.model.y.get();

    const { characters } = characterRegistry;

    let nearest: CharacterModel | null = null;
    let nearestDistSq = MAX_CHASE_RANGE_SQ;

    for (const other of characters) {
      if (other === this.model) {
        continue;
      }

      if (!other.isAlive) {
        continue;
      }

      if (other.isSpawning) {
        continue;
      }

      const dx = other.x.get() - myX;
      const dy = other.y.get() - myY;
      const distSq = dx * dx + dy * dy;

      if (distSq > 0 && distSq < nearestDistSq) {
        nearestDistSq = distSq;
        nearest = other;
      }
    }

    return nearest;
  }

  private applySeparation(): void {
    const myX = this.model.x.get();
    const myY = this.model.y.get();

    const { characters } = characterRegistry;

    for (const other of characters) {
      if (other === this.model) {
        continue;
      }

      if (!other.isAlive) {
        continue;
      }

      if (other.isSpawning) {
        continue;
      }

      const dx = myX - other.x.get();
      const dy = myY - other.y.get();
      const distSq = dx * dx + dy * dy;

      if (distSq > 0 && distSq < SEPARATION_RANGE_SQ) {
        const dist = Math.hypot(dx, dy);

        this.model.vx += (dx / dist) * SEPARATION_FORCE;

        this.model.vy += (dy / dist) * SEPARATION_FORCE;
      }
    }
  }
}
