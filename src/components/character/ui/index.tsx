import { ExplosionEffect } from '@components/effect/ExplosionEffect';
import { SkullEffect } from '@components/effect/SkullEffect';
import { SpawnEffect } from '@components/effect/SpawnEffect';
import { ShowCombo } from '@components/showCombo';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import type { CharacterModel } from '../engine/model';

import { CharacterBottomUI } from './bottom';
import { CharacterSprite } from './sprite/bunny';
import { CharacterTopUI } from './top';

interface CharacterProp {
  id: number;
  model: CharacterModel;
}

class CharacterClass {
  render = ({ model, id }: CharacterProp) => {
    const baseStyle = {
      x: model.x,
      y: model.y,
      translateX: '-50%',
      translateY: '-50%',
      pointerEvents: 'auto' as const,
      touchAction: 'none' as const,
      cursor: 'grab',
      width: 128,
      height: 128,
      willChange: 'transform',
    };

    const renderState = () => {
      if (model.isSpawning) {
        return (
          <SpawnEffect
            key={`spawn-${id}`}
            x={model.spawnX}
            y={model.spawnY}
            onComplete={model.finishSpawn}
          />
        );
      }

      if (model.isDying && !model.dead) {
        return (
          <>
            <ExplosionEffect
              key={`explosion-${id}`}
              x={model.deathX}
              y={model.deathY}
              onComplete={() => {}}
            />

            <SkullEffect
              key={`skull-${id}`}
              id={id}
              x={model.deathX}
              y={model.deathY}
              onComplete={model.markDead}
            />

            {model.showCombo && <ShowCombo key={`combo-${id}`} x={model.deathX} y={model.deathY} />}
          </>
        );
      }

      if (!model.dead) {
        return (
          <motion.div
            drag
            dragElastic={0.1}
            dragMomentum
            style={baseStyle}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 20,
              mass: 0.6,
            }}
            onDrag={(_, info) => {
              model.setVelocity(info.velocity.x / 100, info.velocity.y / 100);

              const localPoint = model.toLocalPoint(info.point.x, info.point.y);
              model.x.set(localPoint.x);
              model.y.set(localPoint.y);
            }}
          >
            <CharacterTopUI model={model} />
            <CharacterSprite model={model} />
            <CharacterBottomUI model={model} />
          </motion.div>
        );
      }

      return null;
    };

    return (
      <AnimatePresence mode="sync" initial={false}>
        {renderState()}
      </AnimatePresence>
    );
  };
}
const characterInstance = new CharacterClass();

export const Character = observer(characterInstance.render);
