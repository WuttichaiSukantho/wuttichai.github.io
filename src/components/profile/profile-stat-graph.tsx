import {
  experienceStartYearMaximum,
  experienceStartYearStats,
} from '@domain/profile/profile-stats';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

const chartWidth = 640;
const chartHeight = 250;
const chartTop = 28;
const chartBottom = 188;
const chartLeft = 48;
const chartRight = 612;
const chartHeightValue = chartBottom - chartTop;

export const ProfileStatGraph = observer(() => (
  <article
    aria-labelledby="profile-stat-graph-heading"
    className="surface-strong mt-6 overflow-hidden p-5 sm:p-7"
  >
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow text-primary">{languageStore.t('profileStats.graphEyebrow')}</p>
        <h3 id="profile-stat-graph-heading" className="mt-2 text-xl font-bold text-foreground">
          {languageStore.t('profileStats.graphHeading')}
        </h3>
      </div>
      <p className="max-w-md text-sm leading-6 text-muted-foreground">
        {languageStore.t('profileStats.graphDescription')}
      </p>
    </div>

    <div className="mt-7">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        aria-labelledby="profile-stat-graph-title profile-stat-graph-description"
        className="h-auto w-full"
      >
        <title id="profile-stat-graph-title">{languageStore.t('profileStats.graphHeading')}</title>
        <desc id="profile-stat-graph-description">
          {languageStore.t('profileStats.graphDescription')}
        </desc>

        {[0, 1, 2, 3].map((tick) => {
          const y = chartBottom - (chartHeightValue / 3) * tick;

          return (
            <line
              key={tick}
              x1={chartLeft}
              x2={chartRight}
              y1={y}
              y2={y}
              className="stroke-white/10"
              strokeWidth="1"
            />
          );
        })}

        {experienceStartYearStats.map((stat, index) => {
          const slotWidth = (chartRight - chartLeft) / experienceStartYearStats.length;
          const barWidth = Math.min(58, slotWidth * 0.56);
          const barHeight = (stat.value / experienceStartYearMaximum) * chartHeightValue;
          const x = chartLeft + slotWidth * index + (slotWidth - barWidth) / 2;
          const y = chartBottom - barHeight;

          return (
            <g key={stat.label}>
              <motion.rect
                initial={{ scaleY: 0, opacity: 0 }}
                whileInView={{ scaleY: 1, opacity: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                style={{ transformOrigin: `${x + barWidth / 2}px ${chartBottom}px` }}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="8"
                className="fill-primary"
              />
              <text
                x={x + barWidth / 2}
                y={Math.max(chartTop + 14, y - 10)}
                textAnchor="middle"
                className="fill-foreground text-[15px] font-bold"
              >
                {stat.value}
              </text>
              <text
                x={x + barWidth / 2}
                y={chartBottom + 28}
                textAnchor="middle"
                className="fill-muted-foreground text-[14px] font-medium"
              >
                {stat.label}
              </text>
            </g>
          );
        })}

        <text x="12" y={chartTop + 4} className="fill-muted-foreground text-[12px]">
          {languageStore.t('profileStats.graphEntries')}
        </text>
      </svg>

      <ul className="mt-2 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:grid-cols-3 lg:grid-cols-5">
        {experienceStartYearStats.map((stat) => (
          <li
            key={stat.label}
            className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2 text-sm"
          >
            <span className="text-muted-foreground">{stat.label}</span>
            <data value={stat.value} className="font-semibold text-foreground">
              {stat.value}
            </data>
          </li>
        ))}
      </ul>
    </div>
  </article>
));
