import { secureRandom } from '@lib/random';
import { makeAutoObservable } from 'mobx';

/* =========================================================
   CharacterSpeech
   - Cycles through random speech bubbles on a timer
   - Owned per-character (each has independent speech state)
========================================================= */

const MIN_DELAY_MS = 2_500;
const MAX_DELAY_MS = 4_500;

const SPEECH_POOL: readonly string[] = [
  'Built different 💪',
  'อย่าจับแรงนะ 😤',
  'ฟาร์มเวลอยู่ 🐰⚡',
  'เด้งได้อีก! 🌀',
  'HP ยังไหว ❤️',
  'โบกมือลา 👋',
  'อย่ากลับหัวฉันนะ 😵‍💫',
  'MobX only 🧠✨',
  'สปีดเกินต้าน 🚀',
  'คอมโบติดแล้ว! 🔥',
  'ยังไม่ตายง่าย ๆ 😎',
  'โหมดจริงจัง ON ⚔️',
  'ใครเรียกฉันเหรอ 👀',
  'ตีเบา ๆ ก็พอ 😅',
  'สกิลพร้อมใช้ ✨',
  'บัฟครบแล้วนะ 📈',
  'อย่า AFK สิ 😑',
  'ลุยต่อไม่มีพัก 🐾',
  'เกิดใหม่ได้ไหมนะ ♻️',
  'วันนี้ก็ยังเทพเหมือนเดิม 🏆',
] as const;

export class CharacterSpeech {
  speech = '';

  #active = false;
  #timerId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  /* ─── Actions ─────────────────────────────────────────── */

  setSpeech(text: string): void {
    if (text !== this.speech) this.speech = text;
  }

  /* ─── Public API ──────────────────────────────────────── */

  startTalking(): void {
    if (this.#active) return;
    this.#active = true;
    this.#scheduleNext();
  }

  stopTalking(): void {
    this.#active = false;
    if (this.#timerId !== null) {
      clearTimeout(this.#timerId);
      this.#timerId = null;
    }
  }

  dispose(): void {
    this.stopTalking();
  }

  /* ─── Private ─────────────────────────────────────────── */

  #scheduleNext(): void {
    if (!this.#active) return;

    const delay = MIN_DELAY_MS + secureRandom() * (MAX_DELAY_MS - MIN_DELAY_MS);

    this.#timerId = setTimeout(() => {
      this.setSpeech(this.#pickRandom());
      this.#scheduleNext();
    }, delay);
  }

  #pickRandom(): string {
    return SPEECH_POOL[Math.trunc(secureRandom() * SPEECH_POOL.length)] ?? '';
  }
}
