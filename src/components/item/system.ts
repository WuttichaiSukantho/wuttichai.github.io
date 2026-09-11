import { secureRandom } from '@lib/random';
import { runInAction } from 'mobx';

import type { CharacterModel } from '../character/engine/model';
import { characterRegistry } from '../character/engine/registry';

import { itemRegistry } from './registry';

/* =========================================================
   ItemSystem
   - เรียกใน physics loop ทุก tick
   - เช็คว่าตัวละครไหนเดินทับ item
   - Apply buff ให้ตัวละครนั้น
========================================================= */

const PICKUP_RADIUS = 72; // px — ใหญ่กว่า radius นิดนึงเพื่อให้รู้สึกดี

export class ItemSystem {
  update(): void {
    const { characters } = characterRegistry;

    for (const character of characters) {
      if (!character.isAlive || character.isSpawning) continue;

      const item = itemRegistry.tryPickup(character.x.get(), character.y.get(), PICKUP_RADIUS);

      if (item) {
        this.#applyBuff(character, item.type, item.def.duration);
        itemRegistry.removeCollected();
      }
    }
  }

  /* ─── Buff application ────────────────────────────────── */

  #applyBuff(character: CharacterModel, type: string, duration: number): void {
    switch (type) {
      case 'heal': {
        runInAction(() => {
          character.hp = Math.min(character.MAX_HP, character.hp + 25);
          character.speechSystem.setSpeech('💚 Heal');
        });
        break;
      }

      case 'megaHeal': {
        runInAction(() => {
          character.hp = Math.min(character.MAX_HP, character.hp + 60);
          character.speechSystem.setSpeech('❤️ Mega Heal');
        });
        break;
      }

      case 'damage': {
        runInAction(() => {
          character.baseDamageMultiplier += 0.6;
        });

        setTimeout(() => {
          runInAction(() => {
            character.baseDamageMultiplier -= 0.6;
          });
        }, duration);
        break;
      }

      case 'shield': {
        runInAction(() => {
          character.isInvincible = true;
        });

        setTimeout(() => {
          runInAction(() => {
            character.isInvincible = false;
          });
        }, duration);
        break;
      }

      case 'haste': {
        runInAction(() => {
          character.speedMultiplier += 1.2;
        });

        setTimeout(() => {
          runInAction(() => {
            character.speedMultiplier -= 1.2;
          });
        }, duration);
        break;
      }

      case 'regen': {
        const interval = setInterval(() => {
          runInAction(() => {
            character.hp = Math.min(character.MAX_HP, character.hp + 2);
          });
        }, 400);

        setTimeout(() => clearInterval(interval), duration);
        break;
      }

      case 'berserk': {
        runInAction(() => {
          character.baseDamageMultiplier += 1;
          character.speedMultiplier += 0.5;
        });

        setTimeout(() => {
          runInAction(() => {
            character.baseDamageMultiplier -= 1;
            character.speedMultiplier -= 0.5;
          });
        }, duration);
        break;
      }

      case 'blink': {
        const angle = secureRandom() * Math.PI * 2;
        const dist = 120;

        character.x.set(character.x.get() + Math.cos(angle) * dist);
        character.y.set(character.y.get() + Math.sin(angle) * dist);

        break;
      }

      case 'magnet': {
        runInAction(() => {
          character.speechSystem.setSpeech('🧲 Magnet!');
        });

        break;
      }
    }
  }
}

export const itemSystem = new ItemSystem();
