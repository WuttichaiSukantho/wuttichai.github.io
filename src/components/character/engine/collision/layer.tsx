import { CollisionEffect } from '@components/effect/Collisioneffect';
import { playgroundSceneLayer } from '@components/playground/playground-scene-layer';
import { observer } from 'mobx-react-lite';

import { collisionRegistry } from './registry';

class CollisionLayerClass {
  render = () => {
    return (
      <div
        className="playground-scene-layer"
        style={{ zIndex: playgroundSceneLayer.effect }}
        aria-hidden="true"
      >
        {collisionRegistry.effects.map((effect) => (
          <CollisionEffect
            key={effect.id}
            x={effect.x}
            y={effect.y}
            onComplete={() => collisionRegistry.remove(effect.id)}
          />
        ))}
      </div>
    );
  };
}
const collisionlayerInstance = new CollisionLayerClass();

export const CollisionLayer = observer(collisionlayerInstance.render);
