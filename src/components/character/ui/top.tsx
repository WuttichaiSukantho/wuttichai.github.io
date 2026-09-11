import type { CharacterModel } from '@components/character/engine/model';
import { observer } from 'mobx-react-lite';

import { SpeechBubble } from './speech';

interface Props {
  model: CharacterModel;
}

class CharacterTopUIClass {
  render = ({ model }: Props) => {
    return (
      <div
        style={{
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 4,
        }}
      >
        <SpeechBubble speech={model.speech} />
      </div>
    );
  };
}
const charactertopuiInstance = new CharacterTopUIClass();

export const CharacterTopUI = observer(charactertopuiInstance.render);
