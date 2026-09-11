import { languageStore } from '@store/language-store';
import { AnimatePresence, motion } from 'framer-motion';
import { observer } from 'mobx-react';
import { Component } from 'react';

interface CookieConsentState {
  isVisible: boolean;
}

class CookieConsentClass extends Component<object, CookieConsentState> {
  private consentTimer: ReturnType<typeof setTimeout> | null = null;

  public override state: CookieConsentState = {
    isVisible: false,
  };

  public override componentDidMount(): void {
    const consent = localStorage.getItem('cookie-consent');

    if (consent) {
      return;
    }

    // Delay the consent dialog so it doesn't appear immediately.
    this.consentTimer = setTimeout(() => {
      this.setState({
        isVisible: true,
      });
    }, 2000);
  }

  public override componentWillUnmount(): void {
    if (this.consentTimer !== null) {
      clearTimeout(this.consentTimer);
      this.consentTimer = null;
    }
  }

  private readonly handleAccept = (): void => {
    localStorage.setItem('cookie-consent', 'accepted');

    this.setState({
      isVisible: false,
    });
  };

  private readonly handleDecline = (): void => {
    localStorage.setItem('cookie-consent', 'declined');

    this.setState({
      isVisible: false,
    });
  };

  public override render(): React.ReactNode {
    const { isVisible } = this.state;

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{
              y: 100,
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              y: 0,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              y: 50,
              opacity: 0,
              scale: 0.95,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="
              fixed
              bottom-[max(1rem,env(safe-area-inset-bottom))]
              left-4
              right-4
              z-50
              mx-auto
              max-w-md
              md:bottom-8
              md:left-auto
              md:right-8
              md:mx-0
            "
          >
            <div
              className="
                glass-card
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-white/10
                bg-black/60
                p-4
                sm:p-6
                shadow-2xl
                backdrop-blur-2xl
              "
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🍪</span>

                  <h3 className="text-lg font-semibold tracking-wide text-white">
                    {languageStore.t('cookie.title')}
                  </h3>
                </div>

                <p className="text-sm leading-relaxed text-white/70">
                  {languageStore.t('cookie.description')}
                </p>
              </div>

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={this.handleAccept}
                  className="
                    flex-1
                    rounded-xl
                    bg-primary
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    tracking-wide
                    text-primary-foreground
                    shadow-lg
                    transition-transform
                    hover:scale-105
                    active:scale-95
                  "
                >
                  {languageStore.t('cookie.accept')}
                </button>

                <button
                  type="button"
                  onClick={this.handleDecline}
                  className="
                    flex-1
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-2.5
                    text-sm
                    font-semibold
                    tracking-wide
                    text-white
                    transition-all
                    hover:bg-white/10
                    active:scale-95
                  "
                >
                  {languageStore.t('cookie.decline')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
}

export const CookieConsent = observer(CookieConsentClass);
