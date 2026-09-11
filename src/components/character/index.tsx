import { Character } from '@components/character/ui';
import { playgroundSceneLayer } from '@components/playground/playground-scene-layer';
import { Component, type CSSProperties } from 'react';

import { CharacterModel } from './engine/model';

/* =========================================================
   CharacterEngine
   - Creates and owns a single CharacterModel
   - Mounts/unmounts the model with the DOM element lifecycle
========================================================= */

type CharacterEngineProps = {
  id: number;
};

const containerStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  zIndex: playgroundSceneLayer.character,
  pointerEvents: 'none',
};

class CharacterEngineClass extends Component<CharacterEngineProps> {
  // Owned once for the lifetime of the instance — equivalent to useLocalObservable
  model = new CharacterModel();

  // Stable ref callback — bound once as a class field, model never changes
  setRef = (el: HTMLDivElement | null) => {
    if (el) this.model.mount(el);
  };

  override componentWillUnmount() {
    this.model.unmount();
  }

  override render() {
    const { id } = this.props;

    return (
      <div ref={this.setRef} style={containerStyle}>
        <Character id={id} model={this.model} />
      </div>
    );
  }
}

export const CharacterEngine = CharacterEngineClass;
