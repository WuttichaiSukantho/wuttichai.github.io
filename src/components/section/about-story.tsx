import { aboutStore } from '@domain/about/about.store';
import { languageStore } from '@store/language-store';
import { motion } from 'framer-motion';
import { observer } from 'mobx-react-lite';

class AboutStoryClass {
  render = () => {
    return (
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-120px' }}
        transition={{ staggerChildren: 0.15 }}
        className="
          relative
          mx-auto
          grid
          container-responsive
          max-w-7xl
          grid-cols-1
          items-center
          gap-16
          py-16
          sm:py-24
          md:grid-cols-2
          lg:gap-20
        "
      >
        {/* Ambient Background Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[140px] -z-10" />

        {/* PROFILE IMAGE CONTAINER */}
        <motion.div
          variants={aboutStore.sectionVariant}
          className="flex justify-center items-center relative group"
        >
          {/* Outer Glow Ring */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-primary/40 via-transparent to-blue-500/30 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

          <div
            className="
              relative
              w-full
              max-w-md
              rounded-3xl
              overflow-hidden
              p-4
              bg-background/40
              backdrop-blur-2xl
              border border-white/10
              shadow-[0_25px_60px_rgba(0,0,0,0.35)]
              transition-transform
              duration-500
              hover:scale-[1.02]
            "
          >
            <img
              src="/wuttichai.github.io/image/profile/profile-photo.webp"
              alt="Wuttichai Sukantho profile"
              width={420}
              height={420}
              loading="lazy"
              decoding="async"
              className="
                w-full
                h-auto
                rounded-2xl
                object-cover
                drop-shadow-[0_0_20px_rgba(220,20,60,0.25)]
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />
          </div>
        </motion.div>

        {/* STORY & DETAILS */}
        <div
          className="
            relative
            flex
            flex-col
            gap-6
            p-5
            sm:p-8
            md:p-10
            rounded-3xl
            bg-background/40
            backdrop-blur-2xl
            border border-white/10
            shadow-[0_30px_100px_rgba(0,0,0,0.3)]
            overflow-hidden
          "
        >
          {/* Top Decorative Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          {/* Heading and Name Group */}
          <div className="flex flex-col gap-2">
            <motion.div
              variants={aboutStore.sectionVariant}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] text-primary uppercase"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{languageStore.t('about.story.eyebrow')}</span>
            </motion.div>

            <motion.h2
              variants={aboutStore.sectionVariant}
              className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl"
            >
              {languageStore.t('about.story.heading')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-blue-400">
                {languageStore.t('about.story.headingAccent')}
              </span>
            </motion.h2>

            <motion.div
              variants={aboutStore.sectionVariant}
              className="text-xl font-bold tracking-wide text-muted-foreground/90 pt-1"
            >
              {languageStore.t('about.story.name')}{' '}
              <span className="text-primary font-medium">
                {languageStore.t('about.story.alias')}
              </span>
            </motion.div>
          </div>

          {/* Expanded Narrative Paragraphs */}
          <div className="flex flex-col gap-4 text-muted-foreground leading-relaxed text-base md:text-lg">
            <motion.p variants={aboutStore.sectionVariant}>
              {languageStore.t('about.story.paragraph1')}
            </motion.p>

            <motion.p
              variants={aboutStore.sectionVariant}
              className="text-sm md:text-base text-muted-foreground/90"
            >
              {languageStore.t('about.story.paragraph2')}
            </motion.p>

            <motion.p
              variants={aboutStore.sectionVariant}
              className="text-sm md:text-base text-muted-foreground/80"
            >
              {languageStore.t('about.story.paragraph3')}
            </motion.p>
          </div>

          {/* Quick Value Badges */}
          <motion.div
            variants={aboutStore.sectionVariant}
            className="flex flex-wrap gap-2 pt-2 border-t border-white/10"
          >
            {(
              [
                ['about.trait.problemSolver', 'Problem Solver'],
                ['about.trait.cleanCode', 'Clean Code Enthusiast'],
                ['about.trait.systemArchitect', 'System Architect'],
              ] as const
            ).map(([key, fallback]) => (
              <span
                key={key}
                className="px-3 py-1 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-primary/90 backdrop-blur-sm"
              >
                {languageStore.t(key) || fallback}
              </span>
            ))}
          </motion.div>
        </div>
      </motion.section>
    );
  };
}

const aboutstoryInstance = new AboutStoryClass();

export const AboutStory = observer(aboutstoryInstance.render);
