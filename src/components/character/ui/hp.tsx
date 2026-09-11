import { motion, type MotionStyle, useMotionValue, useSpring } from 'framer-motion';
import { memo, useEffect, useMemo } from 'react';

interface HpProps {
  hp: number;
  maxHp: number;
}

const HpComponent = ({ hp, maxHp }: HpProps) => {
  /* =======================
       Normalize Percent
    ======================= */

  const percent = useMemo(() => {
    if (!maxHp) return 0;
    const value = hp / maxHp;
    return Math.min(1, Math.max(0, value));
  }, [hp, maxHp]);

  /* =======================
       Motion Values
    ======================= */

  // หลอดจริง (ลดทันที)
  const realProgress = useMotionValue(percent);

  // หลอดเงา (ค่อย ๆ ลดตาม)
  const ghostSpring = useSpring(realProgress, {
    stiffness: 80,
    damping: 22,
    mass: 1.4,
  });

  /* =======================
       Sync Update
    ======================= */

  useEffect(() => {
    realProgress.set(percent);
  }, [percent, realProgress]);

  /* =======================
       Color Logic
    ======================= */

  const color = useMemo(() => {
    if (percent > 0.6) return '#00ff88';
    if (percent > 0.3) return '#ffaa00';
    return '#ff0044';
  }, [percent]);

  return (
    <div style={containerStyle}>
      {/* Ghost bar */}
      <motion.div
        style={{
          ...barStyle,
          scaleX: ghostSpring,
          background: 'rgba(255,255,255,0.25)',
        }}
      />

      {/* Real bar */}
      <motion.div
        style={{
          ...barStyle,
          scaleX: realProgress,
          background: color,
        }}
      />
    </div>
  );
};

HpComponent.displayName = 'Hp';

export const Hp = memo(HpComponent);

/* ================== styles ================== */

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: 80,
  height: 6,
  background: 'rgba(0,0,0,0.45)',
  borderRadius: 999,
  overflow: 'hidden',
};
const barStyle: MotionStyle = {
  position: 'absolute',
  height: '100%',
  width: '100%',
  borderRadius: 999,
  transformOrigin: 'left',
};
