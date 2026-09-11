import type { MotionValue } from 'framer-motion';
import { motion, useTransform } from 'framer-motion';
import { memo } from 'react';

interface ShowComboProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
}

const ShowComboComponent = ({ x, y }: ShowComboProps) => {
  // ลอยขึ้น 200px โดยไม่ trigger layout
  const floatY = useTransform(y, (value) => value - 200);

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1,
        ease: 'easeOut',
      }}
      style={{
        x,
        y: floatY,
        position: 'absolute',
        translateX: '-50%',
        translateY: '-50%',
        fontSize: 32,
        fontWeight: 800,
        color: '#ff0044',
        textShadow: '0 0 10px red',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }}
    >
      ⚡ COMBO KILL ⚡
    </motion.div>
  );
};

ShowComboComponent.displayName = 'ShowCombo';

export const ShowCombo = memo(ShowComboComponent);
