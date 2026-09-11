import { playgroundSceneLayer } from '@components/playground/playground-scene-layer';
import type { TranslationKey } from '@domain/i18n/translations';
import { languageStore } from '@store/language-store';
import { AnimatePresence, motion, type MotionStyle } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import { itemRegistry } from './registry';

/* =========================================================
   Layer Style
========================================================= */

const fieldStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: playgroundSceneLayer.item,
};

const itemPositionStyle: MotionStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  translateX: '-50%',
  translateY: '-50%',
  pointerEvents: 'none',
};

/* =========================================================
   ItemField
========================================================= */

class ItemFieldClass {
  render = () => {
    const items = itemRegistry.items.filter((i) => !i.collected);

    return (
      <div style={fieldStyle}>
        <AnimatePresence>
          {items.map((item) => (
            /* POSITION LAYER */
            <motion.div
              key={item.id}
              style={{
                ...itemPositionStyle,
                x: item.x,
                y: item.y,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* ANIMATION LAYER */}
              <motion.div
                initial={{ scale: 0, opacity: 0, y: -30 }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 1.4,
                    ease: 'easeInOut',
                  },
                  opacity: { duration: 0.3 },
                  y: { duration: 0.4, ease: 'backOut' },
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  filter: `drop-shadow(0 0 10px ${item.def.glowColor}) drop-shadow(0 0 20px ${item.def.glowColor})`,
                }}
              >
                {/* Glow ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  style={{
                    position: 'absolute',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    border: `3px dashed ${item.def.color}`,
                    opacity: 0.6,
                  }}
                />

                {/* Emoji */}
                <span
                  style={{
                    fontSize: 36,
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {item.def.emoji}
                </span>

                {/* Label */}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: item.def.color,
                    maxWidth: 120,
                    textAlign: 'center',
                    overflowWrap: 'anywhere',
                    letterSpacing: 1,
                    marginTop: 28,
                    textShadow: `0 0 8px ${item.def.glowColor}`,
                  }}
                >
                  {languageStore.t(`item.${item.type}` as TranslationKey)}
                </span>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };
}
const itemfieldInstance = new ItemFieldClass();

export const ItemField = observer(itemfieldInstance.render);

ItemField.displayName = 'ItemField';
