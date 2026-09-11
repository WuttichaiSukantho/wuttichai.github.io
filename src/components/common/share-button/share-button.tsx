import { getShareUrl, SHARE_TEXT, SHARE_TITLE } from '@lib/share';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import { ShareDialog } from './share-dialog';

export function ShareButton() {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);
  const handleShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }
    setIsOpen(true);
  };

  return (
    <>
      <motion.button
        type="button"
        aria-label={languageStore.t('share.button')}
        onClick={handleShare}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="interactive-lift inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
      >
        <Share2 size={17} aria-hidden="true" />
        {languageStore.t('share.button')}
      </motion.button>
      <ShareDialog open={isOpen} url={getShareUrl()} onClose={close} />
    </>
  );
}
