import { homeStore } from '@store/home';
import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { Component } from 'react';

interface SkullEffectProps {
  id: number;
  x: MotionValue<number>;
  y: MotionValue<number>;
  onComplete: () => void;
}

export class SkullEffect extends Component<SkullEffectProps> {
  private readonly handleComplete = (): void => {
    const { id, onComplete } = this.props;

    onComplete();
    homeStore.removeById(id);
  };

  override render() {
    const { x, y } = this.props;

    return (
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1.2,
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
        }}
        transition={{
          duration: 0.35,
          ease: 'easeOut',
        }}
        style={{
          position: 'absolute',
          x,
          y,
          translateX: '-50%',
          translateY: '-120%',
          fontSize: 64,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
        onAnimationComplete={this.handleComplete}
      >
        💀
      </motion.div>
    );
  }
}
