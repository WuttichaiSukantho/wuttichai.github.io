import { physicsWorld } from '@components/character/engine/physics-world';
import { viewport } from '@components/character/engine/viewport';
import { FloatingControl } from '@components/control/floating';
import { itemRegistry } from '@components/item/registry';
import { PlaygroundHelp } from '@components/playground/playground-help';
import { PlaygroundHud } from '@components/playground/playground-hud';
import { PlaygroundScene } from '@components/playground/playground-scene';
import { Section } from '@components/section';
import { LeaderboardSection } from '@components/section/leaderboard-section';
import { homeStore } from '@store/home';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import { observer } from 'mobx-react';
import { Component, createRef } from 'react';

interface PlaygroundState {
  isFullscreen: boolean;
}

class Playground extends Component<object, PlaygroundState> {
  private readonly stageRef = createRef<HTMLElement>();
  private readonly playgroundRef = createRef<HTMLDivElement>();

  private visibilityObserver: IntersectionObserver | null = null;

  override state: PlaygroundState = {
    isFullscreen: false,
  };

  override componentDidMount(): void {
    const stage = this.stageRef.current;

    if (stage) {
      viewport.setStage(stage);
    }

    document.addEventListener('fullscreenchange', this.handleFullscreenChange);

    homeStore.hydrate();
    itemRegistry.start();
    physicsWorld.start();

    if (typeof IntersectionObserver !== 'undefined' && this.playgroundRef.current) {
      this.visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;

          if (entry.isIntersecting) {
            itemRegistry.start();
            physicsWorld.start();
          } else {
            itemRegistry.stop();
            physicsWorld.stop();
          }
        },
        { rootMargin: '160px 0px' },
      );
      this.visibilityObserver.observe(this.playgroundRef.current);
    }
  }

  override componentWillUnmount(): void {
    itemRegistry.stop();
    physicsWorld.stop();
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = null;
    homeStore.dispose();
    viewport.clearStage();
    document.removeEventListener('fullscreenchange', this.handleFullscreenChange);
  }

  private readonly handleFullscreenChange = (): void => {
    this.setState({ isFullscreen: document.fullscreenElement === this.playgroundRef.current });
  };

  private readonly toggleFullscreen = async (): Promise<void> => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }

      await this.playgroundRef.current?.requestFullscreen();
    } catch {
      this.setState({ isFullscreen: false });
    }
  };

  override render(): React.ReactNode {
    return (
      <Section id="playground" className="relative min-h-[34rem] overflow-visible">
        <div
          ref={this.playgroundRef}
          className="playground-shell relative isolate min-h-[34rem] w-full"
        >
          <div className="playground-backdrop" aria-hidden="true">
            <div className="playground-orbit playground-orbit-one" />
            <div className="playground-orbit playground-orbit-two" />
          </div>

          <div className="container-responsive section-pad relative z-10 w-full max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mx-auto flex w-full max-w-6xl flex-col gap-5"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="eyebrow text-primary">
                    <Gamepad2 size={14} aria-hidden="true" />
                    {languageStore.t('playground.eyebrow')}
                  </p>
                  <h2 className="heading-section mt-4">{languageStore.t('playground.heading')}</h2>
                  <p className="prose-muted mt-4 max-w-xl text-base">
                    {languageStore.t('playground.intro')}
                  </p>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground/80">
                    {languageStore.t('playground.technicalDetails')}
                  </p>
                </div>
                <div className="w-full md:max-w-xs">
                  <PlaygroundHelp />
                </div>
              </div>
            </motion.div>

            <div className="playground-frame mx-auto mt-8 w-full max-w-6xl overflow-hidden rounded-3xl border border-primary/25 bg-background/25 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.22)] sm:p-3">
              <PlaygroundHud
                characterCount={homeStore.count}
                itemCount={itemRegistry.activeCount}
                autoSpeed={homeStore.autoSpeed}
              />
              <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-stretch lg:gap-8">
                <PlaygroundScene
                  ref={this.stageRef}
                  characters={homeStore.characters}
                  hint={languageStore.t('playground.hint')}
                  label={languageStore.t('playground.scene')}
                  resetVersion={homeStore.resetVersion}
                />

                <FloatingControl
                  count={homeStore.count}
                  canAdd={homeStore.canAdd}
                  autoSpeed={homeStore.autoSpeed}
                  isFullscreen={this.state.isFullscreen}
                  onAdd={homeStore.add}
                  onRemove={homeStore.remove}
                  onReset={homeStore.reset}
                  onSetAuto={homeStore.setAuto}
                  onToggleFullscreen={this.toggleFullscreen}
                />
              </div>
              <LeaderboardSection />
            </div>
          </div>
        </div>
      </Section>
    );
  }
}

export const PlaygroundSection = observer(Playground);
