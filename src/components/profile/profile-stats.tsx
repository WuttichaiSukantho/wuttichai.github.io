import { profileStats, profileStatsMaximum } from '@domain/profile/profile-stats';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

import { ProfileStatGraph } from './profile-stat-graph';

export const ProfileStats = observer(() => (
  <section
    id="profile-stats"
    aria-labelledby="profile-stats-heading"
    className="container-responsive section-pad w-full max-w-7xl"
  >
    <div className="mx-auto max-w-3xl text-center">
      <p className="eyebrow justify-center text-primary">
        {languageStore.t('profileStats.eyebrow')}
      </p>
      <h2 id="profile-stats-heading" className="heading-section mt-4">
        {languageStore.t('profileStats.heading')}
      </h2>
      <p className="prose-muted mx-auto mt-4 max-w-2xl text-base">
        {languageStore.t('profileStats.intro')}
      </p>
    </div>

    <ul className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {profileStats.map((stat, index) => {
        const percentage = (stat.value / profileStatsMaximum) * 100;

        return (
          <motion.li
            key={stat.key}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="surface-strong flex min-h-40 flex-col justify-between p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="max-w-[12rem] text-sm font-semibold leading-5 text-foreground">
                {languageStore.t(stat.key)}
              </h3>
              <data value={stat.value} className="text-2xl font-black text-primary">
                {stat.value}
              </data>
            </div>

            <div className="mt-6" aria-hidden="true">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-crimson-soft"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                <span>{languageStore.t('profileStats.count')}</span>
                <span>{stat.value}</span>
              </div>
            </div>
          </motion.li>
        );
      })}
    </ul>

    <div className="mx-auto max-w-6xl">
      <ProfileStatGraph />
    </div>
  </section>
));
