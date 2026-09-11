import { motion } from 'framer-motion';

interface Props {
  level: number;
}

class LevelBadgeClass {
  render = ({ level }: Props) => {
    return (
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: -4 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 18,
        }}
        style={{
          background: 'linear-gradient(180deg,#ffe082 0%,#ffb300 100%)',

          padding: '2px 7px',
          borderRadius: 999,

          fontSize: 10,
          fontWeight: 700,
          color: '#111',

          border: '1px solid rgba(0,0,0,0.18)',

          boxShadow: '0 1px 2px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.35)',

          lineHeight: 1.1,
          whiteSpace: 'nowrap',
          userSelect: 'none',

          letterSpacing: 0.3,
        }}
      >
        Lv.{level}
      </motion.div>
    );
  };
}
const levelbadgeInstance = new LevelBadgeClass();

export const LevelBadge = levelbadgeInstance.render;
