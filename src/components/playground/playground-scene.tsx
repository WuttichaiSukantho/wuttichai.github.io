import { CharacterEngine } from '@components/character';
import { CollisionLayer } from '@components/character/engine/collision/layer';
import { ItemField } from '@components/item/field';
import { forwardRef } from 'react';

import { PlaygroundSceneBackground } from './playground-scene-background';
import { playgroundSceneLayer } from './playground-scene-layer';

interface PlaygroundCharacter {
  readonly id: number;
}

interface PlaygroundSceneProps {
  readonly characters: readonly PlaygroundCharacter[];
  readonly hint: string;
  readonly label: string;
  readonly resetVersion: number;
}

export const PlaygroundScene = forwardRef<HTMLElement, PlaygroundSceneProps>(
  ({ characters, hint, label, resetVersion }, ref) => (
    <section
      ref={ref}
      aria-label={label}
      aria-describedby="playground-scene-hint"
      className="playground-scene playground-arena surface relative min-h-[26rem] overflow-hidden border-primary/30 bg-white/[0.025] sm:min-h-[34rem] lg:min-h-[38rem]"
    >
      <PlaygroundSceneBackground />

      <div
        className="playground-scene-boundary"
        aria-hidden="true"
        style={{ zIndex: playgroundSceneLayer.decoration }}
      />

      <div className="playground-scene-hint-layer" style={{ zIndex: playgroundSceneLayer.overlay }}>
        <p
          id="playground-scene-hint"
          className="max-w-lg rounded-full border border-primary/15 bg-background/55 px-4 py-2 text-center text-xs leading-5 text-muted-foreground shadow-sm backdrop-blur-sm sm:text-sm"
        >
          {hint}
        </p>
      </div>

      <CollisionLayer />
      <ItemField />
      {characters.map((character) => (
        <CharacterEngine key={`${character.id}-${resetVersion}`} id={character.id} />
      ))}
    </section>
  ),
);

PlaygroundScene.displayName = 'PlaygroundScene';
