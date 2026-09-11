import { aboutStore } from '@domain/about/about.store';
import type { TranslationKey } from '@domain/i18n/translations';
import { educationItems } from '@domain/profile/profile-content';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

class AboutEducationClass {
  render = () => {
    return (
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        transition={{ staggerChildren: 0.15 }}
        className="
          relative
          mx-auto
          max-w-7xl
          px-6
          container-responsive
          py-16
          sm:py-24
        "
      >
        {/* Ambient Background Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -z-10" />

        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-16">
          <motion.div
            variants={aboutStore.sectionVariant}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-primary uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>{languageStore.t('education.eyebrow')}</span>
          </motion.div>

          <motion.h2
            variants={aboutStore.sectionVariant}
            className="text-4xl font-extrabold tracking-tight text-foreground md:text-6xl"
          >
            {languageStore.t('education.heading')}
          </motion.h2>

          <motion.p
            variants={aboutStore.sectionVariant}
            className="text-sm md:text-base text-muted-foreground max-w-xl"
          >
            {languageStore.t('education.intro')}
          </motion.p>
        </div>

        {/* Grid List */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          {educationItems.map((item, index) => {
            const prefix = `education.${index}` as const;
            const title = languageStore.t(`${prefix}.title` as TranslationKey);
            const subtitle = languageStore.t(`${prefix}.subtitle` as TranslationKey);
            const period = languageStore.t(`${prefix}.period` as TranslationKey);
            const description = languageStore.t(`${prefix}.description` as TranslationKey);

            return (
              <motion.article
                key={title}
                variants={aboutStore.sectionVariant}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.3 }}
                className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-background/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.25)] backdrop-blur-2xl transition-all duration-500 hover:border-primary/40 hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] sm:p-7"
              >
                {/* Subtle top inner border gradient glow */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex flex-col gap-5">
                  {/* Preserve each logo's natural aspect ratio instead of forcing a square crop. */}
                  <div className="flex min-h-32 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md sm:min-h-36">
                    <img
                      src={item.src}
                      alt={title}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      decoding="async"
                      className="h-auto max-h-28 w-auto max-w-full object-contain drop-shadow-md sm:max-h-32"
                    />
                  </div>

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                        {subtitle}
                      </span>
                      <h3 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        {title}
                      </h3>
                    </div>

                    {item.period && (
                      <span className="shrink-0 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary backdrop-blur-sm">
                        {period}
                      </span>
                    )}
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {description}
                  </p>
                </div>

                {/* Bottom decorative subtle accent */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-muted-foreground/60">
                  <span>{languageStore.t('education.milestone')}</span>
                  <span className="group-hover:text-primary transition-colors duration-300">
                    &rarr;
                  </span>
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.section>
    );
  };
}

const abouteducationInstance = new AboutEducationClass();

export const AboutEducation = observer(abouteducationInstance.render);
