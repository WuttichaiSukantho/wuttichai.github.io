import type { CharacterModel } from '@components/character/engine/model';
import { animate, motion, motionValue } from 'framer-motion';
import { Component } from 'react';

interface CharacterProp {
  model: CharacterModel;
}

const scaleXSpring = { type: 'spring', stiffness: 420, damping: 28, mass: 0.6 } as const;
const rotateSpring = { type: 'spring', stiffness: 140, damping: 16, mass: 0.8 } as const;

class CharacterSpriteClass extends Component<CharacterProp> {
  // model.directionScale / model.rotation are themselves MotionValue<number> —
  // seed our springs from their current value via .get()
  scaleX = motionValue(this.props.model.directionScale.get());
  rotate = motionValue(this.props.model.rotation.get());

  private readonly unsubscribers: VoidFunction[] = [];

  override componentDidMount() {
    const { model } = this.props;

    // MotionValues have their own change subscription — no mobx needed here.
    // Re-run the spring animation imperatively whenever the source value changes,
    // replacing the re-render-driven retargeting useSpring gave us for free.
    this.unsubscribers.push(
      model.directionScale.on('change', (value) => animate(this.scaleX, value, scaleXSpring)),
      model.rotation.on('change', (value) => animate(this.rotate, value, rotateSpring)),
    );
  }

  override componentWillUnmount() {
    this.unsubscribers.forEach((unsubscribe) => unsubscribe());
  }

  override render() {
    return (
      <div className="relative h-16 w-32 select-none pointer-events-none" aria-hidden="true">
        <motion.div
          className="
          absolute
          inset-0
          bg-no-repeat
          bg-contain
        "
          style={{
            scaleX: this.scaleX,
            rotate: this.rotate,
            filter: this.props.model.colorFilter,
            backgroundImage: "url('/wuttichai.github.io/image/game/bunny-sprite.webp')",
            willChange: 'transform',
          }}
          animate={{
            y: [0, -3, 0],
            scale: [1, 1.03, 1],
            rotateZ: [0, 1, 0, -1, 0],
          }}
          transition={{
            duration: 2.6,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        />
      </div>
    );
  }
}

export const CharacterSprite = CharacterSpriteClass;
