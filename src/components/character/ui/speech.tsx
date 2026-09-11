import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  speech?: string;
}

class SpeechBubbleClass {
  render = ({ speech }: Props) => {
    return (
      <AnimatePresence mode="popLayout">
        {speech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -6 }}
            transition={{
              type: 'spring',
              stiffness: 420,
              damping: 26,
              mass: 0.7,
            }}
            style={{
              position: 'relative',

              background: '#ffffff',
              color: '#111',

              padding: '8px 14px',
              borderRadius: 14,

              fontSize: 13,
              fontWeight: 600,
              lineHeight: 1.35,

              maxWidth: 160,
              textAlign: 'center',
              wordBreak: 'break-word',

              border: '1px solid rgba(0,0,0,0.06)',

              boxShadow: '0 4px 10px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',

              userSelect: 'none',
              backdropFilter: 'blur(2px)',
            }}
          >
            {speech}

            <div
              style={{
                position: 'absolute',
                bottom: -3,
                right: 16,
                width: 6,
                height: 6,
                background: '#fff',
                borderRight: '1px solid rgba(0,0,0,0.06)',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                transform: 'rotate(45deg)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
}
const speechbubbleInstance = new SpeechBubbleClass();

export const SpeechBubble = speechbubbleInstance.render;
