import type { MotionValue } from 'framer-motion';
import { motion } from 'framer-motion';
import { Component } from 'react';

interface SpawnEffectProps {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onComplete: () => void;
}

class SpawnEffect extends Component<SpawnEffectProps> {
  private completionTimer: ReturnType<typeof setTimeout> | null = null;

  public override componentDidMount(): void {
    this.completionTimer = setTimeout(() => {
      this.props.onComplete();
    }, 700);
  }

  public override componentWillUnmount(): void {
    if (this.completionTimer !== null) {
      clearTimeout(this.completionTimer);
      this.completionTimer = null;
    }
  }

  public override render(): React.ReactNode {
    const { x, y } = this.props;

    return (
      <motion.div
        style={{
          position: 'absolute',
          x,
          y,
          pointerEvents: 'none',
          marginLeft: -20,
          marginTop: -10,
          fontSize: 40,
        }}
        initial={{
          scale: 0,
          opacity: 0,
          y: 10,
        }}
        animate={{
          scale: [0, 1.2, 1],
          opacity: [0, 1, 0.9],
        }}
        transition={{
          duration: 0.4,
          ease: 'easeOut',
        }}
      >
        🕳️
      </motion.div>
    );
  }
}

export { SpawnEffect };
