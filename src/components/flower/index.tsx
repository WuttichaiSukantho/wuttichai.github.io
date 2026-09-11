import { motion, type MotionStyle } from 'framer-motion';
import { Component } from 'react';

import { FlowerStore } from './store';

const FLOWER_COUNT = 12;

const layerStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  overflow: 'hidden',
  pointerEvents: 'none',
  zIndex: 0,
};

const flowerStyle: MotionStyle = {
  willChange: 'transform, opacity',
  pointerEvents: 'none',
  userSelect: 'none',
  filter: 'blur(0.3px)',
};

class FlowerComponent extends Component {
  private readonly store = new FlowerStore(FLOWER_COUNT);

  public override render(): React.ReactNode {
    const { flowers } = this.store;

    return (
      <div style={layerStyle} aria-hidden="true">
        {flowers.map((flower) => (
          <motion.img
            key={flower.id}
            src="/wuttichai.github.io/image/decoration/flower.webp"
            alt=""
            draggable={false}
            style={
              {
                ...flowerStyle,
                ...flower.layoutStyle,
              } as MotionStyle
            }
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.8,
            }}
            animate={{
              y: -260,
              x: [0, -6, 6, 0],
              rotate: [0, 6, -6, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: flower.duration,
              ease: 'linear',
              repeat: Infinity,
              delay: flower.delay,
            }}
          />
        ))}
      </div>
    );
  }
}

export const Flower = FlowerComponent;
