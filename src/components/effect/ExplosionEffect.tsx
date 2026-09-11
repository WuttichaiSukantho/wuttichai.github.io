import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { Component } from 'react';

interface ExplosionEffectProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onComplete: () => void;
}

export class ExplosionEffect extends Component<ExplosionEffectProps> {
  override render() {
    const { x, y, onComplete } = this.props;

    return (
      <motion.div
        initial={{
          scale: 0,
          opacity: 0.9,
        }}
        animate={{
          scale: [0, 2.5, 3],
          opacity: [0.9, 0.7, 0],
        }}
        transition={{
          duration: 0.45,
          ease: 'easeOut',
        }}
        style={{
          position: 'absolute',
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff 0%, #ff8800 40%, #ff0000 70%, transparent 75%)',
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
        onAnimationComplete={onComplete}
      />
    );
  }
}
