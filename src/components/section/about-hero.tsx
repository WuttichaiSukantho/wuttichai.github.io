import { aboutStore } from '@domain/about/about.store';
import { skills } from '@domain/profile/profile-content';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';
export const AboutHero = observer(() => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-80px' }}
    transition={{ staggerChildren: 0.1 }}
    className="container-responsive section-pad grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center"
  >
    <div className="surface-strong p-6 sm:p-8 lg:p-10">
      <motion.p variants={aboutStore.sectionVariant} className="eyebrow text-primary">
        {languageStore.t('about.hero.eyebrow')}
      </motion.p>
      <motion.h2 variants={aboutStore.sectionVariant} className="heading-section mt-4">
        {languageStore.t('about.hero.heading')}
      </motion.h2>
      <motion.div
        variants={aboutStore.sectionVariant}
        className="prose-muted mt-6 space-y-4 text-base"
      >
        <p>{languageStore.t('about.hero.paragraph1')}</p>
        <p>{languageStore.t('about.hero.paragraph2')}</p>
      </motion.div>
      <motion.div
        variants={aboutStore.sectionVariant}
        className="mt-8 flex flex-wrap gap-2 border-t border-white/10 pt-5"
      >
        {skills.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-foreground/80"
          >
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
    <motion.figure variants={aboutStore.sectionVariant} className="mx-auto w-full max-w-lg">
      <div className="surface overflow-hidden p-2">
        <img
          src="/wuttichai.github.io/profile/backend-3d.svg"
          width={700}
          height={300}
          loading="lazy"
          decoding="async"
          alt="Animated engineering illustration"
          className="w-full rounded-md object-cover"
        />
      </div>
      <figcaption className="mt-3 text-center text-xs text-muted-foreground">
        {languageStore.t('about.hero.caption')}
      </figcaption>
    </motion.figure>
  </motion.div>
));
