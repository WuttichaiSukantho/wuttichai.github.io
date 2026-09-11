import { type MotionValue, motionValue } from 'framer-motion';
import { makeAutoObservable } from 'mobx';

/* =========================================================
   Item Types
========================================================= */

export type ItemType =
  | 'speed'
  | 'invincible'
  | 'heal'
  | 'megaHeal'
  | 'damage'
  | 'shield'
  | 'slow'
  | 'haste'
  | 'regen'
  | 'berserk'
  | 'blink'
  | 'magnet';

export interface ItemDef {
  type: ItemType;
  emoji: string;
  label: string;
  color: string;
  glowColor: string;
  duration: number; // ms ที่ buff อยู่
}
export const ITEM_DEFS: Record<ItemType, ItemDef> = {
  speed: {
    type: 'speed',
    emoji: '⚡',
    label: 'Speed UP!',
    color: '#ffe066',
    glowColor: 'rgba(255,220,50,0.8)',
    duration: 5000,
  },

  invincible: {
    type: 'invincible',
    emoji: '🛡️',
    label: 'Invincible!',
    color: '#66f0ff',
    glowColor: 'rgba(80,200,255,0.8)',
    duration: 4000,
  },

  heal: {
    type: 'heal',
    emoji: '💚',
    label: 'Heal',
    color: '#66ff99',
    glowColor: 'rgba(100,255,150,0.9)',
    duration: 0,
  },

  megaHeal: {
    type: 'megaHeal',
    emoji: '❤️',
    label: 'Mega Heal',
    color: '#ff6b6b',
    glowColor: 'rgba(255,100,100,0.9)',
    duration: 0,
  },

  damage: {
    type: 'damage',
    emoji: '🔥',
    label: 'Damage UP',
    color: '#ff9f43',
    glowColor: 'rgba(255,150,80,0.9)',
    duration: 6000,
  },

  shield: {
    type: 'shield',
    emoji: '🧱',
    label: 'Shield',
    color: '#8da2fb',
    glowColor: 'rgba(120,150,255,0.9)',
    duration: 5000,
  },

  slow: {
    type: 'slow',
    emoji: '🐌',
    label: 'Slow',
    color: '#a29bfe',
    glowColor: 'rgba(160,140,255,0.9)',
    duration: 4000,
  },

  haste: {
    type: 'haste',
    emoji: '💨',
    label: 'Haste',
    color: '#81ecec',
    glowColor: 'rgba(100,255,255,0.9)',
    duration: 5000,
  },

  regen: {
    type: 'regen',
    emoji: '🌿',
    label: 'Regeneration',
    color: '#55efc4',
    glowColor: 'rgba(100,255,200,0.9)',
    duration: 7000,
  },

  berserk: {
    type: 'berserk',
    emoji: '😈',
    label: 'Berserk',
    color: '#ff4757',
    glowColor: 'rgba(255,70,90,0.9)',
    duration: 5000,
  },

  blink: {
    type: 'blink',
    emoji: '✨',
    label: 'Blink',
    color: '#e056fd',
    glowColor: 'rgba(230,100,255,0.9)',
    duration: 0,
  },

  magnet: {
    type: 'magnet',
    emoji: '🧲',
    label: 'Magnet',
    color: '#feca57',
    glowColor: 'rgba(255,200,80,0.9)',
    duration: 6000,
  },
};

/* =========================================================
   ItemModel  (one per item on the ground)
========================================================= */

let nextItemId = 0;

export class ItemModel {
  readonly id: number;
  readonly type: ItemType;
  readonly def: ItemDef;

  readonly x: MotionValue<number>;
  readonly y: MotionValue<number>;

  collected = false;

  constructor(type: ItemType, x: number, y: number) {
    this.id = nextItemId++;
    this.type = type;
    this.def = ITEM_DEFS[type];
    this.x = motionValue(x);
    this.y = motionValue(y);

    makeAutoObservable(
      this,
      {
        x: false,
        y: false,
      },
      { autoBind: true },
    );
  }

  collect(): void {
    this.collected = true;
  }
}
