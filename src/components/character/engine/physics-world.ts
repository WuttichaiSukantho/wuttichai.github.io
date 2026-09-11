import { PhysicsSystem } from './physics-system';

/* =========================================================
   PhysicsWorld
   - Drives one lightweight simulation step per animation frame.
   - Avoids catch-up bursts that make the bunny visibly jump after
     a busy frame, tab switch, or mobile scroll.
========================================================= */

export class PhysicsWorld {
  readonly #physics = new PhysicsSystem();

  #animationId: number | null = null;

  /* ─── Public API ──────────────────────────────────────── */

  start(): void {
    if (this.#animationId !== null) return;
    this.#animationId = requestAnimationFrame(this.#loop);
  }

  stop(): void {
    if (this.#animationId !== null) {
      cancelAnimationFrame(this.#animationId);
      this.#animationId = null;
    }
  }

  /* ─── Loop ────────────────────────────────────────────── */

  readonly #loop = (): void => {
    // Motion values are rendered by the same RAF cadence, so doing one
    // update here prevents multiple writes in a single visual frame.
    this.#physics.update();

    this.#animationId = requestAnimationFrame(this.#loop);
  };
}

/* Singleton — one physics world for the whole app */
export const physicsWorld = new PhysicsWorld();
