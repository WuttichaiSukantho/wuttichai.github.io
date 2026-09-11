import { languageStore } from '@store/language-store';

export const PlaygroundHelp = () => (
  <details className="group rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-foreground">
    <summary className="cursor-pointer list-none px-4 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      <span className="inline-flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 text-primary"
          aria-hidden="true"
        >
          ?
        </span>
        {languageStore.t('playground.help')}
      </span>
    </summary>
    <div className="border-t border-white/10 px-4 pb-4 pt-3 leading-6 text-muted-foreground">
      {languageStore.t('playground.instructions')}
    </div>
  </details>
);
