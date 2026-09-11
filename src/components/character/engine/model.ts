import { secureRandom } from '@lib/random';
import { type MotionValue, motionValue } from 'framer-motion';
import { makeAutoObservable, runInAction } from 'mobx';

import { CharacterAI } from './ai';
import { CharacterCombat } from './combat';
import { characterProgression } from './progression';
import { characterRegistry } from './registry';
import { CharacterSpeech } from './speech';

/* =========================================================
   Constants
========================================================= */

const BASE_MAX_SPEED = 14; // เร็วขึ้นมาก → ชนแรงขึ้นตาม
const HP_REGEN_RATE = 0.05;
const HP_REGEN_DELAY = 180;
const SPAWN_RADIUS = 64; // ขนาดจริงของตัวละคร (px)
const SPAWN_SPREAD = 400; // กระจาย spawn ให้กว้างขึ้น ลดโอกาสชนกัน
const SPAWN_LAND_OFFSET = 40;
const BUNNY_FILTERS = [
  'hue-rotate(0deg) saturate(1.05)',
  'hue-rotate(28deg) saturate(1.15)',
  'hue-rotate(72deg) saturate(1.1)',
  'hue-rotate(150deg) saturate(1.1)',
  'hue-rotate(220deg) saturate(1.15)',
  'hue-rotate(285deg) saturate(1.1)',
] as const;

/* =========================================================
   CharacterModel
========================================================= */

export class CharacterModel {
  /* ─── Static counter ──────────────────────────────────── */
  private static nextId = 0;

  /* ─── Identity ────────────────────────────────────────── */
  readonly id: number;
  readonly colorFilter: string;
  mass: number;

  /* ─── Progression (observable) ────────────────────────── */
  level = 1;
  exp = 0;
  expToNext = 100;
  MAX_HP = 100;
  hp = 100;
  baseDamageMultiplier = 1;
  speedMultiplier = 1;

  /* ─── State (observable) ──────────────────────────────── */
  isSpawning = true;
  isDying = false;
  dead = false;
  showCombo = false;
  isInvincible = false; // buff จาก item 🛡️
  isShielded = false;
  isHaste = false;
  isRegenerating = false;
  isBerserk = false;
  isMagnetActive = false;
  damageBoost = false;

  /* ─── Direction (non-observable — driven via directionScale MotionValue) */
  direction: 'left' | 'right' = 'right';

  /* ─── MotionValues (not observable — framer-motion owns them) */
  readonly x: MotionValue<number> = motionValue(0);
  readonly y: MotionValue<number> = motionValue(0);
  readonly spawnX: MotionValue<number> = motionValue(0);
  readonly spawnY: MotionValue<number> = motionValue(0);
  readonly deathX: MotionValue<number> = motionValue(0);
  readonly deathY: MotionValue<number> = motionValue(0);
  readonly rotation: MotionValue<number> = motionValue(0);
  readonly directionScale: MotionValue<number> = motionValue(1);

  /* ─── Velocity (non-observable — hot path in physics loop) */
  vx = 0;
  vy = 0;

  /* ─── DOM ref (non-observable) ───────────────────────────*/
  container: HTMLDivElement | null = null;

  /* ─── Regen tracking (non-observable — use plain JS field) ─*/
  // Declared outside MobX annotation map intentionally.
  // makeAutoObservable skips fields starting with underscore by convention,
  // but the cleanest solution is to initialise it after makeAutoObservable.
  private ticksSinceLastCombat!: number;

  /* ─── Per-character systems ───────────────────────────── */
  readonly speechSystem = new CharacterSpeech();
  private readonly aiSystem = new CharacterAI(this);
  private readonly combatSystem = new CharacterCombat();

  /* =========================================================
       Constructor
    ========================================================= */

  constructor() {
    this.id = CharacterModel.nextId++;
    this.colorFilter = BUNNY_FILTERS[this.id % BUNNY_FILTERS.length] ?? BUNNY_FILTERS[0];
    this.mass = Math.PI * 64 * 64 * 0.001; // ~12.87

    makeAutoObservable(
      this,
      {
        /* non-observable: hot path */
        vx: false,
        vy: false,
        direction: false,
        container: false,

        /* non-observable: framer-motion owns these */
        x: false,
        y: false,
        spawnX: false,
        spawnY: false,
        deathX: false,
        deathY: false,
        rotation: false,
        directionScale: false,

        /* Nested systems already own their observable state. */
        speechSystem: false,
      },
      { autoBind: true },
    );

    // Initialise AFTER makeAutoObservable so MobX never tracks this field
    this.ticksSinceLastCombat = 0;
  }

  /* =========================================================
       Computed
    ========================================================= */

  get damageMultiplier(): number {
    return this.baseDamageMultiplier;
  }

  get maxSpeed(): number {
    return BASE_MAX_SPEED * this.speedMultiplier;
  }

  get isAlive(): boolean {
    return this.hp > 0;
  }

  get canMove(): boolean {
    return !this.isSpawning && !this.isDying && this.isAlive;
  }

  get speech(): string {
    return this.speechSystem.speech;
  }

  get name(): string {
    return `${this.id}`;
  }

  get displayName(): string {
    return `${this.name} (Lv.${this.level})`;
  }

  /* =========================================================
       Lifecycle
    ========================================================= */

  mount(container: HTMLDivElement): void {
    this.container = container;

    const { px, py } = this.findFreeSpawnPosition();

    this.x.set(px);
    this.y.set(py);
    this.spawnX.set(px);
    this.spawnY.set(py);
    this.vx = 0;
    this.vy = 0;

    characterRegistry.add(this);
    this.speechSystem.startTalking();
  }

  /**
   * หาตำแหน่ง spawn ที่ไม่ซ้อนกับตัวอื่น
   * ลองสุ่มสูงสุด MAX_ATTEMPTS ครั้ง ถ้าหาไม่ได้ใช้ตำแหน่งสุดท้าย
   */
  private findFreeSpawnPosition(): { px: number; py: number } {
    const SPAWN_MIN_DIST_SQ = (SPAWN_RADIUS * 2) ** 2; // ต้องห่างกัน > diameter
    const MAX_ATTEMPTS = 20;

    const stageWidth = this.container?.clientWidth ?? window.innerWidth;
    const stageHeight = this.container?.clientHeight ?? window.innerHeight;
    const cx = stageWidth / 2;
    const cy = stageHeight / 2;

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const px = Math.min(
        Math.max(cx + (secureRandom() - 0.5) * SPAWN_SPREAD, SPAWN_RADIUS),
        Math.max(SPAWN_RADIUS, stageWidth - SPAWN_RADIUS),
      );
      const py = Math.min(
        Math.max(cy + (secureRandom() - 0.5) * SPAWN_SPREAD, SPAWN_RADIUS),
        Math.max(SPAWN_RADIUS, stageHeight - SPAWN_RADIUS),
      );

      let overlapping = false;
      for (const other of characterRegistry.characters) {
        if (!other.isAlive) continue;
        const dx = other.x.get() - px;
        const dy = other.y.get() - py;
        if (dx * dx + dy * dy < SPAWN_MIN_DIST_SQ) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) return { px, py };
    }

    // fallback — spawn ที่มุมสุ่มรอบขอบจอ
    const angle = secureRandom() * Math.PI * 2;
    const margin = SPAWN_RADIUS * 3;
    return {
      px: Math.min(
        Math.max(cx + Math.cos(angle) * Math.max(stageWidth / 2 - margin, 0), SPAWN_RADIUS),
        Math.max(SPAWN_RADIUS, stageWidth - SPAWN_RADIUS),
      ),
      py: Math.min(
        Math.max(cy + Math.sin(angle) * Math.max(stageHeight / 2 - margin, 0), SPAWN_RADIUS),
        Math.max(SPAWN_RADIUS, stageHeight - SPAWN_RADIUS),
      ),
    };
  }

  toLocalPoint(clientX: number, clientY: number): { x: number; y: number } {
    const bounds = this.container?.getBoundingClientRect();

    if (!bounds) {
      return { x: clientX, y: clientY };
    }

    return {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    };
  }

  unmount(): void {
    this.speechSystem.stopTalking();
    characterRegistry.remove(this);
  }

  /* =========================================================
       Movement
    ========================================================= */

  setVelocity(vx: number, vy: number): void {
    if (!this.canMove) return;
    this.vx = vx;
    this.vy = vy;
  }

  stop(): void {
    this.vx = 0;
    this.vy = 0;
  }

  /* =========================================================
       AI
    ========================================================= */

  seekTarget(): void {
    if (!this.canMove) return;
    this.aiSystem.update();
  }

  /* =========================================================
       Combat
    ========================================================= */

  handleCombat(other: CharacterModel): void {
    if (!this.canMove) return;
    this.ticksSinceLastCombat = 0;
    this.combatSystem.resolve(this, other);
  }

  /** Hook up a visual effect callback (e.g. particle sparks on hit) */
  setEffectCallback(callback: ((midX: number, midY: number) => void) | null): void {
    this.combatSystem.onEffect = callback;
  }

  tickRegen(): void {
    if (!this.isAlive || this.isDying) return;
    if (this.hp >= this.MAX_HP) return;

    this.ticksSinceLastCombat++;
    if (this.ticksSinceLastCombat < HP_REGEN_DELAY) return;

    this.hp = Math.min(this.MAX_HP, this.hp + HP_REGEN_RATE);
  }

  rewardKill(victim: CharacterModel): void {
    characterProgression.onKill(this, victim);
  }

  /* =========================================================
       Spawn
    ========================================================= */

  finishSpawn(): void {
    requestAnimationFrame(() => {
      this.x.set(this.spawnX.get());
      this.y.set(this.spawnY.get() + SPAWN_LAND_OFFSET);

      runInAction(() => {
        this.isSpawning = false;

        const angle = secureRandom() * Math.PI * 2;
        const speed = this.maxSpeed * 0.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
      });
    });
  }

  /* =========================================================
       Death
    ========================================================= */

  markDead(): void {
    this.dead = true;
  }
}
