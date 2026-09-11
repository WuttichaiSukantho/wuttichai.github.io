import type { CharacterModel } from '@components/character/engine/model';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';

interface LeaderboardPodiumProps {
  readonly entries: readonly CharacterModel[];
  readonly formatNumber: (value: number) => string;
}

function getPodiumTone(rank: number): string {
  if (rank === 1) return 'border-amber-400/40 bg-amber-400/[0.12]';
  if (rank === 2) return 'border-slate-300/30 bg-slate-300/[0.1]';
  return 'border-orange-500/30 bg-orange-500/[0.1]';
}

function getPodiumOrder(rank: number): string {
  if (rank === 1) return 'order-1 md:order-2 md:-translate-y-4';
  if (rank === 2) return 'order-2 md:order-1';
  return 'order-3';
}

export const LeaderboardPodium = ({ entries, formatNumber }: LeaderboardPodiumProps) => (
  <div aria-labelledby="leaderboard-podium-heading">
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow text-primary">{languageStore.t('leaderboard.podiumEyebrow')}</p>
        <h3 id="leaderboard-podium-heading" className="mt-2 text-xl font-bold text-foreground">
          {languageStore.t('leaderboard.podiumHeading')}
        </h3>
      </div>
      <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">
        {languageStore.t('leaderboard.level')} · {languageStore.t('leaderboard.hp')}
      </span>
    </div>

    <ol className="grid gap-3 md:grid-cols-3 md:items-end md:gap-4">
      {entries.map((entry, index) => {
        const rank = index + 1;

        return (
          <motion.li
            key={entry.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className={`relative flex items-center gap-4 rounded-2xl border p-4 ${getPodiumTone(rank)} ${getPodiumOrder(rank)}`}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/20 text-xl font-black text-foreground tabular-nums">
              #{rank}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-2">
                <span className="text-lg" aria-hidden="true">
                  🐇
                </span>
                <span className="truncate font-bold text-foreground">{entry.name}</span>
              </span>
              <span className="mt-1 block text-sm tabular-nums text-muted-foreground">
                Lv.{formatNumber(entry.level)} · {formatNumber(entry.hp)} HP
              </span>
            </span>
          </motion.li>
        );
      })}
    </ol>
  </div>
);
