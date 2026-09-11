import { languageStore } from '@store/language-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Component } from 'react';

interface InitialLoaderState {
  isLoading: boolean;
}

export class InitialLoader extends Component<object, InitialLoaderState> {
  private loaderTimeout: number | undefined = undefined;

  override state: InitialLoaderState = {
    isLoading: true,
  };

  override componentDidMount(): void {
    this.loaderTimeout = globalThis.window.setTimeout(() => {
      this.setState({ isLoading: false });
    }, 800);
  }

  override componentWillUnmount(): void {
    if (this.loaderTimeout !== undefined) {
      globalThis.window.clearTimeout(this.loaderTimeout);
    }
  }

  override render() {
    const { isLoading } = this.state;

    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            id="initial-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            role="status"
            aria-live="polite"
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#090a0c] text-foreground"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(220,20,60,0.16),transparent_34%),linear-gradient(135deg,#090a0c_0%,#111316_52%,#090a0c_100%)]" />
            <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 1.2, ease: 'linear' },
              }}
              className="relative z-10 grid size-20 place-items-center rounded-full border border-white/10 bg-white/[0.035] shadow-[0_0_55px_rgba(220,20,60,0.22)]"
            >
              <span className="absolute inset-1 rounded-full border-2 border-transparent border-t-primary border-r-crimson-soft" />
              <span className="grid size-11 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-[0_8px_25px_rgba(220,20,60,0.38)]">
                W
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
              className="relative z-10 mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-primary"
            >
              Wuttichai Portfolio
            </motion.p>
            <p className="relative z-10 mt-2 text-sm text-muted-foreground">
              {languageStore.t('loader.loading')}
            </p>
            <div className="relative z-10 mt-5 h-1 w-36 overflow-hidden rounded-full bg-white/10">
              <motion.span
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.25, ease: 'easeInOut' }}
                className="block h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-crimson-soft to-transparent"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}
