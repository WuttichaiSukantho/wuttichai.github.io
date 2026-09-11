import { copyShareUrl } from '@lib/share';
import { languageStore } from '@store/language-store';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ShareDialogProps {
  readonly open: boolean;
  readonly url: string;
  readonly onClose: () => void;
}

const socialLinks = [
  {
    key: 'facebook',
    label: 'Facebook',
    color: 'bg-[#1877f2]',
    url: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: 'x',
    label: 'X / Twitter',
    color: 'bg-black',
    url: (url: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    color: 'bg-[#0a66c2]',
    url: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    key: 'line',
    label: 'LINE',
    color: 'bg-[#06c755]',
    url: (url: string) =>
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`,
  },
] as const;

function getSocialMark(key: string, label: string): string {
  if (key === 'x') return '𝕏';
  if (key === 'line') return 'L';
  return label[0] ?? '';
}

export function ShareDialog({ open, url, onClose }: ShareDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector<HTMLElement>('button, a')?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    globalThis.window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      globalThis.window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, open]);

  const handleCopy = async () => {
    if (!(await copyShareUrl(url))) return;
    setCopied(true);
    globalThis.window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] grid items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-dialog-title"
            className="w-full max-w-md rounded-2xl border border-white/15 bg-background p-5 shadow-2xl sm:p-6"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-primary">{languageStore.t('share.eyebrow')}</p>
                <h2 id="share-dialog-title" className="mt-2 text-xl font-semibold text-foreground">
                  {languageStore.t('share.title')}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {languageStore.t('share.description')}
                </p>
              </div>
              <button
                type="button"
                aria-label={languageStore.t('nav.close')}
                onClick={onClose}
                className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/10 text-muted-foreground transition hover:bg-white/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-6 flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 text-left transition hover:border-primary/60 hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            >
              <span className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                  {copied ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    <Copy size={16} aria-hidden="true" />
                  )}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {copied ? languageStore.t('share.copied') : languageStore.t('share.copy')}
                </span>
              </span>
              <span className="max-w-[11rem] truncate text-xs text-muted-foreground">{url}</span>
            </button>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.key}
                  href={social.url(url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="group flex min-h-11 items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-medium text-foreground transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`grid size-7 place-items-center rounded-lg text-xs font-bold text-white ${social.color}`}
                    >
                      {getSocialMark(social.key, social.label)}
                    </span>
                    {social.label}
                  </span>
                  <ExternalLink
                    size={14}
                    className="text-muted-foreground transition group-hover:text-primary"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="shrink-0 rounded-lg bg-white p-1.5 shadow-lg">
                <img
                  src="/qrcode.webp"
                  alt={languageStore.t('share.qrAlt')}
                  width={88}
                  height={88}
                  className="size-[5.5rem]"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {languageStore.t('share.qrTitle')}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {languageStore.t('share.qrDescription')}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
