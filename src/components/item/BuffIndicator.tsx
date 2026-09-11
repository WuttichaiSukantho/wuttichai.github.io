import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import type { CharacterModel } from '../character/engine/model';

interface BuffIndicatorProps {
  model: CharacterModel;
}

interface BuffConfig {
  key: string;
  emoji: string;
  glow: string;
  pulse?: boolean;
  active: (m: CharacterModel) => boolean;
}

class BuffIndicatorClass {
  render = ({ model }: BuffIndicatorProps) => {
    const BUFFS: BuffConfig[] = [
      {
        key: 'speed',
        emoji: '⚡',
        glow: '#ffe066',
        active: (m) => m.speedMultiplier > 1 || m.isHaste,
      },

      {
        key: 'invincible',
        emoji: '🛡️',
        glow: '#66f0ff',
        pulse: true,
        active: (m) => m.isInvincible,
      },

      {
        key: 'shield',
        emoji: '🧱',
        glow: '#74b9ff',
        pulse: true,
        active: (m) => m.isShielded,
      },

      {
        key: 'damage',
        emoji: '🔥',
        glow: '#ff9f43',
        active: (m) => m.damageBoost || m.damageMultiplier > 1,
      },

      {
        key: 'regen',
        emoji: '🌿',
        glow: '#55efc4',
        active: (m) => m.isRegenerating,
      },

      {
        key: 'berserk',
        emoji: '😈',
        glow: '#ff4757',
        pulse: true,
        active: (m) => m.isBerserk,
      },

      {
        key: 'magnet',
        emoji: '🧲',
        glow: '#feca57',
        active: (m) => m.isMagnetActive,
      },
    ];

    const activeBuffs = BUFFS.filter((buff) => buff.active(model));

    return (
      <div
        style={{
          position: 'absolute',
          top: -48,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 4,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {activeBuffs.map((buff) => (
            <motion.div
              key={buff.key}
              initial={{ scale: 0, opacity: 0, y: 8 }}
              animate={{
                scale: buff.pulse ? [1, 1.25, 1] : 1,
                opacity: 1,
                y: 0,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                scale: buff.pulse
                  ? { repeat: Infinity, duration: 0.9 }
                  : { type: 'spring', stiffness: 420, damping: 24 },
              }}
              style={{
                fontSize: 20,
                filter: `drop-shadow(0 0 8px ${buff.glow})`,
                lineHeight: 1,
              }}
            >
              {buff.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };
}
const buffindicatorInstance = new BuffIndicatorClass();

export const BuffIndicator = observer(buffindicatorInstance.render);

BuffIndicator.displayName = 'BuffIndicator';
