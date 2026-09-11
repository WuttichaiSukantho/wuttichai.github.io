import type { CharacterModel } from '@components/character/engine/model';
import { motion } from 'framer-motion';

interface LeaderboardRowProps {
  readonly entry: CharacterModel;
  readonly rank: number;
  readonly formatNumber: (value: number) => string;
  readonly mobile?: boolean;
}

function getRankTone(rank: number): string {
  if (rank === 1) return 'text-amber-300';
  if (rank === 2) return 'text-slate-200';
  if (rank === 3) return 'text-orange-300';
  return 'text-muted-foreground';
}

export const LeaderboardRow = ({
  entry,
  rank,
  formatNumber,
  mobile = false,
}: LeaderboardRowProps) => {
  if (mobile) {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 8 }}
        className="flex items-center gap-3 px-4 py-4"
      >
        <span
          className={`w-10 shrink-0 text-center text-sm font-black tabular-nums ${getRankTone(rank)}`}
        >
          #{rank}
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-lg" aria-hidden="true">
            🐇
          </span>
          <span className="truncate font-semibold text-foreground">{entry.name}</span>
        </span>
        <span className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">
          <span className="block font-semibold text-foreground">
            Lv.{formatNumber(entry.level)}
          </span>
          <span>{formatNumber(entry.hp)} HP</span>
        </span>
      </motion.div>
    );
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="border-b border-white/[0.06] transition-colors hover:bg-white/[0.04]"
    >
      <th scope="row" className={`px-6 py-4 text-sm font-black tabular-nums ${getRankTone(rank)}`}>
        #{rank}
      </th>
      <td className="max-w-[18rem] px-6 py-4">
        <span className="flex min-w-0 items-center gap-3">
          <span className="text-lg" aria-hidden="true">
            🐇
          </span>
          <span className="truncate font-semibold text-foreground">{entry.name}</span>
        </span>
      </td>
      <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-foreground">
        Lv.{formatNumber(entry.level)}
      </td>
      <td className="px-6 py-4 text-right text-sm font-semibold tabular-nums text-muted-foreground">
        {formatNumber(entry.hp)} HP
      </td>
    </motion.tr>
  );
};
