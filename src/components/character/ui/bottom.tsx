import type { CharacterModel } from '@components/character/engine/model';
import { Hp } from '@components/character/ui/hp';
import { observer } from 'mobx-react-lite';

import { CharacterName } from './name';

interface Props {
  model: CharacterModel;
}

class CharacterBottomUIClass {
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
        <CharacterName id={model.id} level={model.level} />
        <Hp hp={model.hp} maxHp={model.MAX_HP} />
      </div>
    );
  };
}
const characterbottomuiInstance = new CharacterBottomUIClass();

export const CharacterBottomUI = observer(characterbottomuiInstance.render);
