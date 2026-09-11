import { itemSystem } from '@components/item/system';

import { collisionRegistry } from './collision/registry';
import type { CharacterModel } from './model';
import { characterRegistry } from './registry';
import { SpatialHash } from './spatial-hash';
import { viewport } from './viewport';

const RADIUS = 64;
const DIAMETER = RADIUS * 2;
const DIAMETER_SQ = DIAMETER * DIAMETER;
const CONTACT_RELEASE_DISTANCE_SQ = (DIAMETER + 14) ** 2;

const FRICTION = 0.97;
const RESTITUTION = 0.85;
const CENTER_FORCE = 0.0008;
const WALL_BOUNCE = 0.85;

const TURN_THRESHOLD = 0.35;
const MIN_COMBAT_SPEED = 0.3;
const AI_UPDATE_INTERVAL_FRAMES = 3;

interface IntegrationBounds {
  readonly centerX: number;
  readonly centerY: number;
  readonly minX: number;
  readonly maxX: number;
  readonly minY: number;
  readonly maxY: number;
}

export class PhysicsSystem {
  readonly #grid = new SpatialHash(DIAMETER);
  #frame = 0;

  update(): void {
    this.#frame++;
    const { characters } = characterRegistry;

    const scrollX = viewport.scrollX;
    const scrollY = viewport.scrollY;
    const vw = viewport.width;
    const vh = viewport.height;

    const minX = scrollX + RADIUS;
    const maxX = scrollX + vw - RADIUS;
    const minY = scrollY + RADIUS;
    const maxY = scrollY + vh - RADIUS;

    itemSystem.update();
    this.#integrate(
      characters,
      {
        centerX: scrollX + vw * 0.5,
        centerY: scrollY + vh * 0.5,
        minX,
        maxX,
        minY,
        maxY,
      },
      this.#frame % AI_UPDATE_INTERVAL_FRAMES === 0,
    );
    this.#populateGrid(characters);
    this.#resolveNearbyCollisions(characters);
  }

  #integrate(
    characters: readonly CharacterModel[],
    bounds: IntegrationBounds,
    updateAI: boolean,
  ): void {
    for (const c of characters) {
      if (updateAI) c.seekTarget();
      c.tickRegen();
      c.vx += (bounds.centerX - c.x.get()) * CENTER_FORCE;
      c.vy += (bounds.centerY - c.y.get()) * CENTER_FORCE;

      const speed = Math.hypot(c.vx, c.vy);
      if (speed > c.maxSpeed) {
        const inv = c.maxSpeed / speed;
        c.vx *= inv;
        c.vy *= inv;
      }

      this.#updateDirection(c);
      const x = this.#constrainPosition(c, c.x.get() + c.vx, bounds.minX, bounds.maxX, 'x');
      const y = this.#constrainPosition(c, c.y.get() + c.vy, bounds.minY, bounds.maxY, 'y');
      c.x.set(x);
      c.y.set(y);
      c.vx *= FRICTION;
      c.vy *= FRICTION;
    }
  }

  #constrainPosition(
    character: CharacterModel,
    position: number,
    min: number,
    max: number,
    axis: 'x' | 'y',
  ): number {
    if (position < min) {
      character[axis === 'x' ? 'vx' : 'vy'] *= -WALL_BOUNCE;
      return min;
    }
    if (position > max) {
      character[axis === 'x' ? 'vx' : 'vy'] *= -WALL_BOUNCE;
      return max;
    }
    return position;
  }

  #populateGrid(characters: readonly CharacterModel[]): void {
    this.#grid.clear();
    for (const character of characters) this.#grid.insert(character);
  }

  #resolveNearbyCollisions(characters: readonly CharacterModel[]): void {
    for (const character of characters) {
      const nearby = this.#grid.query(character.x.get(), character.y.get());
      for (const element of nearby) {
        if (element && element !== character && element.id > character.id) {
          this.#resolveCollision(character, element);
        }
      }
    }
  }

  /* ───────────────────────────── */

  #updateDirection(c: CharacterModel): void {
    if (c.direction === 'right' && c.vx < -TURN_THRESHOLD) {
      c.direction = 'left';
      c.directionScale.set(-1);
    } else if (c.direction === 'left' && c.vx > TURN_THRESHOLD) {
      c.direction = 'right';
      c.directionScale.set(1);
    }
  }

  #resolveCollision(a: CharacterModel, b: CharacterModel): void {
    if (a.isSpawning || b.isSpawning) return;

    const ax = a.x.get();
    const ay = a.y.get();
    const bx = b.x.get();
    const by = b.y.get();

    const dx = bx - ax;
    const dy = by - ay;

    const distSq = dx * dx + dy * dy;

    /* ── not collide ── */

    // Keep a small release margin so a pair does not rapidly toggle between
    // active/inactive while resting on the edge of the collision radius.
    if (distSq >= CONTACT_RELEASE_DISTANCE_SQ) {
      collisionRegistry.deactivate(a.id, b.id);
      return;
    }

    if (distSq >= DIAMETER_SQ) return;

    const dist = Math.hypot(dx, dy) || 0.0001;

    const nx = dx / dist;
    const ny = dy / dist;

    /* ── collision effect ── */

    if (!collisionRegistry.isActive(a.id, b.id)) {
      collisionRegistry.activate(a.id, b.id);

      if (collisionRegistry.canSpawnEffect(a.id, b.id)) {
        collisionRegistry.spawn((ax + bx) * 0.5, (ay + by) * 0.5);
      }
    }

    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;

    const vel = rvx * nx + rvy * ny;

    if (vel > 0) return;

    const invA = 1 / a.mass;
    const invB = 1 / b.mass;

    const j = (-(1 + RESTITUTION) * vel) / (invA + invB);

    a.vx -= nx * j * invA;
    a.vy -= ny * j * invA;

    b.vx += nx * j * invB;
    b.vy += ny * j * invB;

    const penetration = DIAMETER - dist;

    const correction = (Math.max(penetration - 0.5, 0) / (invA + invB)) * 0.8;

    a.x.set(ax - nx * correction * invA);
    a.y.set(ay - ny * correction * invA);

    b.x.set(bx + nx * correction * invB);
    b.y.set(by + ny * correction * invB);

    if (Math.abs(vel) > MIN_COMBAT_SPEED) {
      a.handleCombat(b);
    }
  }
}
