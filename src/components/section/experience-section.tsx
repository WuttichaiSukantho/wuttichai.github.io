import { experienceItems, professionalSkills } from '@domain/profile/profile-content';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { BriefcaseBusiness, CheckCircle2, Code2 } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { Section } from '.';

function formatExperienceDuration(
  startDate: string,
  endDate: string | undefined,
  today: Date,
): string {
  const startParts = startDate.split('-').map(Number);
  const startYear = startParts[0] ?? today.getFullYear();
  const startMonth = startParts[1] ?? today.getMonth() + 1;
  const endParts = (
    endDate ?? `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  )
    .split('-')
    .map(Number);
  const endYear = endParts[0] ?? today.getFullYear();
  const endMonth = endParts[1] ?? today.getMonth() + 1;
  const totalMonths = Math.max(1, (endYear - startYear) * 12 + endMonth - startMonth + 1);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (languageStore.language === 'th') {
    return formatDurationParts(years > 0 ? `${years} ปี` : '', months > 0 ? `${months} เดือน` : '');
  }

  const yearLabel = years === 1 ? 'year' : 'years';
  const monthLabel = months === 1 ? 'month' : 'months';
  return formatDurationParts(
    years > 0 ? `${years} ${yearLabel}` : '',
    months > 0 ? `${months} ${monthLabel}` : '',
  );
}

function formatDurationParts(years: string, months: string): string {
  return [years, months].filter(Boolean).join(' ');
}

export const ExperienceSection = observer(() => {
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  return (
    <Section id="experience">
      <div className="container-responsive section-pad w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="eyebrow justify-center text-primary">
            <BriefcaseBusiness size={14} aria-hidden="true" />
            {languageStore.t('experience.eyebrow')}
          </p>
          <h2 className="heading-section mt-4">{languageStore.t('experience.heading')}</h2>
          <p className="mt-3 text-sm text-primary">
            {languageStore.language === 'th'
              ? 'แหล่งข้อมูล: แอป wuttichai_web และเว็บไซต์ Firebase'
              : 'Source: wuttichai_web app and live Firebase portfolio'}
          </p>
          <p className="prose-muted mx-auto mt-4 max-w-2xl text-base">
            {languageStore.t('experience.intro')}
          </p>
        </motion.div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="surface-strong p-5 sm:p-6 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Code2 size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {languageStore.t('experience.summaryLabel')}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {languageStore.t('experience.verified')}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {languageStore.t('experience.summary')}
            </p>

            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {languageStore.t('experience.skills')}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {professionalSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-foreground/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.aside>

          <div className="relative space-y-4 before:absolute before:bottom-5 before:left-[1.1rem] before:top-5 before:w-px before:bg-primary/20 sm:before:left-[1.35rem]">
            {experienceItems.map((item, index) => (
              <motion.article
                key={`${item.company}-${item.periodKey}`}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: index * 0.08, ease: 'easeOut' }}
                className="surface relative ml-5 p-5 sm:ml-7 sm:p-6"
              >
                <span className="absolute -left-[1.55rem] top-6 grid size-7 place-items-center rounded-full border border-primary/30 bg-background text-primary sm:-left-[1.95rem]">
                  <CheckCircle2 size={14} aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {item.role}
                    </p>
                    <h3 className="mt-1 break-words text-lg font-bold text-foreground sm:text-xl">
                      {item.company}
                    </h3>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {languageStore.t(item.periodKey)}
                    </p>
                    <div className="mt-1 flex flex-wrap justify-start gap-1.5 text-xs text-muted-foreground sm:justify-end">
                      {today && (
                        <span>{formatExperienceDuration(item.startDate, item.endDate, today)}</span>
                      )}
                      {item.employmentKey && (
                        <span className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-primary">
                          {languageStore.t(item.employmentKey)}
                        </span>
                      )}
                      {item.locationKey && <span>{languageStore.t(item.locationKey)}</span>}
                    </div>
                  </div>
                </div>
                <p className="mt-5 border-t border-white/10 pt-4 text-sm leading-7 text-muted-foreground">
                  {languageStore.t(item.descriptionKey)}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
});
