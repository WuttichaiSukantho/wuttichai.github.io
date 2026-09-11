import { motion } from 'framer-motion';

import { LevelBadge } from './level';

interface Props {
  id: number;
  level: number;
}

class CharacterNameClass {
  render = ({ id, level }: Props) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 320,
          damping: 22,
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,

          fontSize: 11,
          fontWeight: 700,
          color: '#fff',

          textShadow: '0 1px 2px rgba(0,0,0,0.7)',
          userSelect: 'none',
          maxWidth: 140,
          textAlign: 'center',
          overflowWrap: 'anywhere',
        }}
      >
        {id}
        <LevelBadge level={level} />
      </motion.div>
    );
  };
}
const characternameInstance = new CharacterNameClass();

export const CharacterName = characternameInstance.render;
