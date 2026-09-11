import type { AutoSpeed } from '@store/home';
import { languageStore } from '@store/language-store';
import { Maximize2, Minimize2, RotateCcw } from 'lucide-react';
import { Component } from 'react';

interface FloatingControlProps {
  readonly count: number;
  readonly autoSpeed: AutoSpeed;
  readonly canAdd: boolean;
  readonly isFullscreen: boolean;
  readonly onAdd: () => void;
  readonly onRemove: () => void;
  readonly onReset: () => void;
  readonly onSetAuto: (speed: AutoSpeed) => void;
  readonly onToggleFullscreen: () => void;
}

export class FloatingControl extends Component<FloatingControlProps> {
  private readonly speeds: readonly AutoSpeed[] = [1, 2, 3];

  private readonly handleSetAuto = (speed: AutoSpeed): void => {
    const { autoSpeed, onSetAuto } = this.props;
    onSetAuto(autoSpeed === speed ? 0 : speed);
  };

  public override render(): React.ReactNode {
    const { autoSpeed, canAdd, count, isFullscreen, onAdd, onRemove, onReset, onToggleFullscreen } =
      this.props;

    return (
      <aside className="surface-strong relative flex h-full w-full flex-col gap-4 overflow-hidden p-4 sm:p-5 lg:max-w-[15rem]">
        <div className="pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full bg-primary/20 blur-2xl" />

        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] text-foreground sm:text-sm">
            <span className="text-base" aria-hidden="true">
              🐇
            </span>
            <span>{languageStore.t('control.title')}</span>
          </div>
          <button
            type="button"
            onClick={onToggleFullscreen}
            aria-label={
              isFullscreen
                ? languageStore.t('playground.exitFullscreen')
                : languageStore.t('playground.fullscreen')
            }
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-foreground/80 transition-colors hover:bg-white/[0.12]"
          >
            {isFullscreen ? (
              <Minimize2 size={16} aria-hidden="true" />
            ) : (
              <Maximize2 size={16} aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="relative grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onRemove}
            disabled={count <= 1}
            aria-label={languageStore.t('control.remove')}
            className="min-h-11 rounded-xl border border-white/10 bg-white/[0.05] text-xl font-bold text-foreground transition-colors hover:border-white/25 hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-35"
          >
            −
          </button>
          <button
            type="button"
            onClick={onAdd}
            disabled={!canAdd}
            aria-label={languageStore.t('control.add')}
            className="min-h-11 rounded-xl border border-primary/30 bg-primary/15 text-xl font-bold text-primary transition-colors hover:border-primary/50 hover:bg-primary/25"
          >
            +
          </button>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {languageStore.t('control.speed')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {this.speeds.map((speed) => {
              const active = autoSpeed === speed;

              return (
                <button
                  key={speed}
                  type="button"
                  onClick={() => this.handleSetAuto(speed)}
                  aria-label={`${languageStore.t('control.speed')} ×${speed}`}
                  aria-pressed={active}
                  className={`min-h-10 rounded-xl border text-xs font-semibold transition-colors ${
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-white/10 bg-white/[0.04] text-foreground/80 hover:border-white/25 hover:bg-white/[0.1]'
                  }`}
                >
                  ×{speed}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-auto inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-white/[0.08]"
        >
          <RotateCcw size={15} aria-hidden="true" />
          {languageStore.t('playground.reset')}
        </button>
      </aside>
    );
  }
}
