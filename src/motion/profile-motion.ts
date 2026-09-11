import type { Transition } from 'framer-motion';

export const profileAnimation = {
  scale: [1, 1.08, 1],
};

export const profileTransition: Transition = {
  duration: 1.2,
  repeat: Infinity,
  ease: 'easeInOut',
};
