import { languageStore } from '@store/language-store';
import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { LeaderboardPodium } from './leaderboard-podium';
import { LeaderboardRow } from './leaderboard-row';
import { leaderboardStore } from './store';

const pageSize = 12;
const numberFormatter = new Intl.NumberFormat('en-US');

function formatNumber(value: number): string {
  return numberFormatter.format(Math.max(0, Math.trunc(value)));
}

export const LeaderboardBoard = observer(() => {
  const ranking = leaderboardStore.ranking;
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(ranking.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageItems = ranking.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  const topThree = ranking.slice(0, 3);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [currentPage, page]);

  if (ranking.length === 0) {
    return (
      <div className="surface-strong flex min-h-64 flex-col items-center justify-center p-8 text-center">
        <span className="text-4xl" aria-hidden="true">
          🐇
        </span>
        <h3 className="mt-4 text-lg font-bold text-foreground">
          {languageStore.t('leaderboard.empty')}
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          {languageStore.t('leaderboard.emptyDescription')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LeaderboardPodium entries={topThree} formatNumber={formatNumber} />

      <div className="surface-strong overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {languageStore.t('leaderboard.entries')}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {languageStore.t('leaderboard.description')}
            </p>
          </div>
          <p className="text-sm font-medium tabular-nums text-muted-foreground">
            {formatNumber(ranking.length)} {languageStore.t('leaderboard.entries')}
          </p>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[42rem] text-left">
            <caption className="sr-only">{languageStore.t('leaderboard.heading')}</caption>
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <tr>
                <th scope="col" className="w-24 px-6 py-4">
                  {languageStore.t('leaderboard.rank')}
                </th>
                <th scope="col" className="px-6 py-4">
                  {languageStore.t('leaderboard.player')}
                </th>
                <th scope="col" className="w-32 px-6 py-4 text-right">
                  {languageStore.t('leaderboard.level')}
                </th>
                <th scope="col" className="w-40 px-6 py-4 text-right">
                  {languageStore.t('leaderboard.hp')}
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false} mode="popLayout">
                {pageItems.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.id}
                    entry={entry}
                    rank={currentPage * pageSize + index + 1}
                    formatNumber={formatNumber}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-white/10 md:hidden">
          <AnimatePresence initial={false} mode="popLayout">
            {pageItems.map((entry, index) => (
              <LeaderboardRow
                key={entry.id}
                entry={entry}
                rank={currentPage * pageSize + index + 1}
                formatNumber={formatNumber}
                mobile
              />
            ))}
          </AnimatePresence>
        </div>

        <nav
          aria-label={languageStore.t('leaderboard.heading')}
          className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-4 sm:px-6"
        >
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(0, value - 1))}
            disabled={currentPage === 0}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
          >
            ← {languageStore.t('leaderboard.previous')}
          </button>
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {languageStore.t('leaderboard.page')} {currentPage + 1}{' '}
            {languageStore.t('leaderboard.of')} {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages - 1, value + 1))}
            disabled={currentPage === totalPages - 1}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35"
          >
            {languageStore.t('leaderboard.next')} →
          </button>
        </nav>
      </div>
    </div>
  );
});
