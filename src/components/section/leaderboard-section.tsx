import { LeaderboardBoard } from '@components/leaderboard/board';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import { Section } from '.';

class LeaderboardSectionClass {
  render = () => {
    return (
      <Section id="leaderboard" className="relative z-0 mt-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="
            relative
            w-full
            max-w-6xl
            mx-auto
            flex
            flex-col
            gap-4
            container-responsive
            pt-4
            pb-16
            sm:pt-6
            sm:pb-24
            border-t
            border-white/10
            p-3
            sm:p-5
            overflow-hidden
          "
        >
          {/* Ambient Background Glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[140px] -z-10" />

          {/* HEADER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between gap-4 border-b border-white/10 px-1 pb-4 md:flex-row md:items-end sm:pb-5"
          >
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-primary uppercase">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span>{languageStore.t('leaderboard.eyebrow')}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                {languageStore.t('leaderboard.heading')}
              </h2>
              <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                {languageStore.t('leaderboard.description')}
              </p>
              <p className="max-w-xl text-xs leading-5 text-muted-foreground/75 sm:text-sm">
                {languageStore.t('leaderboard.context')}
              </p>
            </div>

            {/* Live Indicator Badge */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md self-start md:self-auto">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold tracking-wider text-foreground/80">
                {languageStore.t('leaderboard.live')}
              </span>
            </div>
          </motion.div>

          {/* BOARD CONTAINER */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="
              relative
              rounded-2xl
              p-2
              sm:p-3
              bg-background/40
              backdrop-blur-2xl
              border border-white/10
              shadow-[0_30px_100px_rgba(0,0,0,0.35)]
              overflow-hidden
            "
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <LeaderboardBoard />
          </motion.div>
        </motion.div>
      </Section>
    );
  };
}

const leaderboardsectionInstance = new LeaderboardSectionClass();

export const LeaderboardSection = observer(leaderboardsectionInstance.render);
