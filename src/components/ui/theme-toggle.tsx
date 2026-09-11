import { languageStore } from '@store/language-store';
import { themeStore } from '@store/theme-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { observer } from 'mobx-react';
import { Component } from 'react';

/* =========================================================
   Motion
========================================================= */

const iconMotion = {
  initial: {
    rotate: -90,
    opacity: 0,
    scale: 0.6,
  },

  animate: {
    rotate: 0,
    opacity: 1,
    scale: 1,
  },

  exit: {
    rotate: 90,
    opacity: 0,
    scale: 0.6,
  },
};

/* =========================================================
   Component
========================================================= */

class ThemeToggleClass extends Component {
  override componentDidMount(): void {
    themeStore.init();
  }

  override componentWillUnmount(): void {
    themeStore.dispose();
  }

  private renderIcon() {
    switch (themeStore.mode) {
      case 'light':
        return <Sun size={18} strokeWidth={2.2} />;

      case 'dark':
        return <Moon size={18} strokeWidth={2.2} />;

      default:
        return <Monitor size={18} strokeWidth={2.2} />;
    }
  }

  override render() {
    if (!themeStore.hydrated) {
      return (
        <button
          type="button"
          className="h-9 w-9 rounded-xl border border-border"
          aria-label={languageStore.t('theme.loading')}
          disabled
        />
      );
    }

    return (
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.88 }}
        onClick={themeStore.toggle}
        className="
          relative
          flex h-9 w-9 items-center justify-center
          rounded-xl
          border border-white/10
          bg-white/10
          text-white/80
          backdrop-blur-xl
          transition
          hover:bg-white/20
          hover:text-white
        "
        aria-label={`${languageStore.t('theme.switch')} (${themeStore.mode})`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={themeStore.mode}
            variants={iconMotion}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.28,
              ease: 'easeInOut',
            }}
          >
            {this.renderIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }
}

export const ThemeToggle = observer(ThemeToggleClass);
