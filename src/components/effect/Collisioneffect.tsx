import { motion } from 'framer-motion';
import { Component } from 'react';

const EMOJIS = ['💥', '⚡', '✨', '🔥'] as const;

interface CollisionEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

interface Particle {
  id: number;
  tx: number;
  ty: number;
}

/**
 * Deterministic pseudo-random value.
 *
 * Unlike Math.random(), this is pure and always returns
 * the same value for the same input.
 */
class CollisionEffectEngine {
  static readonly PARTICLE_COUNT = 6;

  /**
   * Deterministic pseudo-random value.
   *
   * Unlike Math.random(), this is pure and always returns
   * the same value for the same input.
   */
  static pseudoRandom(seed: number): number {
    const value = Math.sin(seed * 12.9898) * 43758.5453;

    return value - Math.floor(value);
  }

  static createParticles(): Particle[] {
    return Array.from(
      {
        length: CollisionEffectEngine.PARTICLE_COUNT,
      },
      (_, index) => {
        const angle = (index / CollisionEffectEngine.PARTICLE_COUNT) * Math.PI * 2;

        const distance = 40 + CollisionEffectEngine.pseudoRandom(index + 1) * 40;

        return {
          id: index,
          tx: Math.cos(angle) * distance,
          ty: Math.sin(angle) * distance,
        };
      },
    );
  }
}

export class CollisionEffect extends Component<CollisionEffectProps> {
  private readonly particles: Particle[] = CollisionEffectEngine.createParticles();

  private readonly emoji: (typeof EMOJIS)[number];

  constructor(props: CollisionEffectProps) {
    super(props);

    const emojiIndex = Math.floor(
      CollisionEffectEngine.pseudoRandom(props.x + props.y) * EMOJIS.length,
    );

    this.emoji = EMOJIS[emojiIndex] ?? EMOJIS[0];
  }

  override render() {
    const { x, y, onComplete } = this.props;

    return (
      <motion.div
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: 0,
        }}
        transition={{
          duration: 0.4,
        }}
        onAnimationComplete={onComplete}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        {/* Core */}

        <motion.div
          initial={{
            scale: 0.3,
          }}
          animate={{
            scale: [0.3, 1.8, 0.6],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 0.35,
          }}
          style={{
            position: 'absolute',
            fontSize: 64,
          }}
        >
          {this.emoji}
        </motion.div>

        {/* Ring */}

        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 2.5,
            opacity: 0,
          }}
          transition={{
            duration: 0.35,
          }}
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: '3px solid orange',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Particles */}

        {this.particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: 0,
              y: 0,
              opacity: 1,
            }}
            animate={{
              x: particle.tx,
              y: particle.ty,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
            }}
            style={{
              position: 'absolute',
              width: 5,
              height: 5,
              background: 'white',
              borderRadius: '50%',
            }}
          />
        ))}
      </motion.div>
    );
  }
}
