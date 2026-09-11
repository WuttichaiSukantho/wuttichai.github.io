import {
  profileBuildAreas,
  profileTechnologies,
  type ProfileTechnologyGroup,
} from '@domain/profile/profile-technology';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { Boxes, Braces, Layers3, ServerCog, Sparkles } from 'lucide-react';
import { observer } from 'mobx-react-lite';

import { Section } from '.';

const groupOrder: readonly ProfileTechnologyGroup[] = [
  'Frontend',
  'Runtime and tooling',
  'State and interaction',
  'UI and deployment',
];

const groupIcons = {
  Frontend: Boxes,
  'Runtime and tooling': Braces,
  'State and interaction': ServerCog,
  'UI and deployment': Layers3,
} as const;

const groupLabels = {
  Frontend: { en: 'Frontend', th: 'Frontend' },
  'Runtime and tooling': { en: 'Runtime and tooling', th: 'Runtime และเครื่องมือ' },
  'State and interaction': { en: 'State and interaction', th: 'State และ interaction' },
  'UI and deployment': { en: 'UI and deployment', th: 'UI และ deployment' },
} as const;

export const ProfileStackSection = observer(() => {
  const language = languageStore.language;

  return (
    <Section id="tech-stack">
      <div className="container-responsive section-pad w-full max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow justify-center text-primary">
            <Sparkles size={14} aria-hidden="true" />
            {languageStore.t('stack.eyebrow')}
          </p>
          <h2 className="heading-section mt-4">{languageStore.t('stack.heading')}</h2>
          <p className="prose-muted mx-auto mt-4 max-w-2xl text-base">
            {languageStore.t('stack.intro')}
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="surface-strong p-6 sm:p-8">
            <h3 className="text-xl font-bold text-foreground">
              {languageStore.t('stack.buildHeading')}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {languageStore.t('stack.buildIntro')}
            </p>
            <div className="mt-6 space-y-4">
              {profileBuildAreas.map((area) => (
                <article key={area.title.en} className="border-l-2 border-primary/30 pl-4">
                  <h4 className="font-semibold text-foreground">{area.title[language]}</h4>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {area.description[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {groupOrder.map((group, index) => {
              const Icon = groupIcons[group];
              const technologies = profileTechnologies.filter(
                (technology) => technology.group === group,
              );

              return (
                <motion.article
                  key={group}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="surface flex flex-col p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <h3 className="text-sm font-bold text-foreground">
                      {groupLabels[group][language]}
                    </h3>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {technologies.map((technology) => (
                      <li key={technology.name}>
                        <p className="text-sm font-semibold text-foreground">{technology.name}</p>
                        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                          {technology.description[language]}
                        </p>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-6xl rounded-2xl border border-primary/15 bg-primary/[0.06] p-5 text-sm leading-7 text-muted-foreground sm:p-6">
          <strong className="text-foreground">{languageStore.t('stack.architectureLabel')}</strong>{' '}
          {languageStore.t('stack.architecture')}
        </div>
      </div>
    </Section>
  );
});
