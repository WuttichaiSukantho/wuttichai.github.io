import type { AutoSpeed } from '@store/home';
import { languageStore } from '@store/language-store';

interface PlaygroundHudProps {
  readonly characterCount: number;
  readonly itemCount: number;
  readonly autoSpeed: AutoSpeed;
}

interface HudMetricProps {
  readonly label: string;
  readonly value: string;
}

const HudMetric = ({ label, value }: HudMetricProps) => (
  <div className="min-w-0 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 sm:px-4">
    <p className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
      {label}
    </p>
    <p className="mt-1 text-lg font-black tabular-nums text-foreground sm:text-xl">{value}</p>
  </div>
);

export const PlaygroundHud = ({ characterCount, itemCount, autoSpeed }: PlaygroundHudProps) => (
  <div
    aria-label={languageStore.t('playground.hud')}
    className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 sm:gap-3 sm:p-3"
  >
    <HudMetric label={languageStore.t('playground.characters')} value={String(characterCount)} />
    <HudMetric label={languageStore.t('playground.items')} value={String(itemCount)} />
    <HudMetric
      label={languageStore.t('playground.autoSpeed')}
      value={autoSpeed === 0 ? '—' : `×${autoSpeed}`}
    />
  </div>
);
