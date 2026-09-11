import type { MotionStyle, Transition } from 'framer-motion';
import type { CSSProperties } from 'react';

import type { SeedRandom } from './seed';

/* =========================================================
   Flower Model (Immutable + GPU Optimized)
========================================================= */

export class FlowerModel {
  readonly id: number;

  readonly size: number;
  readonly top: number;
  readonly left: number;

  readonly opacity: number;

  readonly duration: number;
  readonly delay: number;

  readonly xRange: number;
  readonly yRange: number;
  readonly rotateRange: number;

  constructor(id: number, random: SeedRandom) {
    this.id = id;

    // Layout
    this.size = 250 + random.next() * 400;
    this.top = random.next() * 100;
    this.left = random.next() * 100;

    // Visual
    this.opacity = 0.35 + random.next() * 0.4;

    // Motion timing
    this.duration = 70 + random.next() * 60;
    this.delay = random.next() * 30;

    // Motion range
    this.xRange = 40 + random.next() * 40;
    this.yRange = 40 + random.next() * 60;
    this.rotateRange = 10 + random.next() * 20;

    Object.freeze(this); // ป้องกัน mutation + ช่วย V8 optimize
  }

  /* ---------- static layout ---------- */

  get layoutStyle(): CSSProperties {
    return {
      position: 'absolute',
      top: `${this.top}%`,
      left: `${this.left}%`,
      width: this.size,
      height: this.size,

      // GPU Hint
      transform: 'translate3d(-50%, -50%, 0)',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
    };
  }

  /* ---------- base motion style ---------- */

  get motionStyle(): MotionStyle {
    return {
      opacity: this.opacity,
    };
  }

  /* ---------- optimized animation ---------- */

  get animate() {
    return {
      x: this.xRange,
      y: -this.yRange,
      rotate: this.rotateRange,
    };
  }

  get transition(): Transition {
    return {
      duration: this.duration,
      delay: this.delay,
      ease: 'linear', // smooth กว่า easeInOut
      repeat: Infinity,
      repeatType: 'reverse', // ลด keyframe cost
    };
  }
}
