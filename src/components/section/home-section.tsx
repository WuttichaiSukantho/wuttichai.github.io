import { ShareButton } from '@components/common/share-button/share-button';
import { profileIdentity } from '@domain/profile/profile-identity';
import { profileAnimation, profileTransition } from '@motion/profile-motion';
import { languageStore } from '@store/language-store';
import { navbarStore } from '@store/navbar-store';
import { motion } from 'framer-motion';
import { ArrowDown, BriefcaseBusiness, Code2, UserPlus } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { FaLinkedinIn } from 'react-icons/fa';
import { SiFacebook, SiGithub, SiInstagram, SiSpotify, SiX, SiYoutube } from 'react-icons/si';

import { Section } from '.';

const profileLinks = [
  {
    label: 'GitHub',
    handle: 'WuttichaiSukantho',
    href: 'https://github.com/WuttichaiSukantho',
    Icon: SiGithub,
  },
  {
    label: 'LinkedIn',
    handle: 'wuttichai-sukantho',
    href: 'https://www.linkedin.com/in/wuttichai-sukantho-0939b1241/',
    Icon: FaLinkedinIn,
  },
  {
    label: 'Facebook',
    handle: 'WuttichaiSukantho',
    href: 'https://www.facebook.com/WuttichaiSukantho/',
    Icon: SiFacebook,
  },
  {
    label: 'Instagram',
    handle: 'wuttichaisukantho',
    href: 'https://www.instagram.com/wuttichaisukantho/',
    Icon: SiInstagram,
  },
  {
    label: 'Spotify',
    handle: 'Wuttichai Sukantho',
    href: 'https://open.spotify.com/user/31m7xrvae43ro2et7rn2mcayuoke',
    Icon: SiSpotify,
    accent: 'spotify',
  },
  {
    label: 'YouTube',
    handle: 'Wuttichai Sukantho',
    href: 'https://www.youtube.com/channel/UCaXiIq_Vs-h94xb-CIW7JUg',
    Icon: SiYoutube,
  },
  { label: 'X', handle: '@Wuttichai_WS', href: 'https://twitter.com/Wuttichai_WS', Icon: SiX },
  {
    label: 'JobsDB',
    handle: profileIdentity.thaiName,
    href: 'https://th.jobsdb.com/profiles/วุฒิชัย-สุคันโฑ-2vytXlpx0N',
    Icon: BriefcaseBusiness,
  },
] as const;

class HomeSectionClass {
  render = () => (
    <Section
      id="home"
      className="relative items-start justify-center py-16 sm:py-24 lg:min-h-[calc(100dvh-4.5rem)]"
    >
      <div className="container-responsive relative grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
        <div className="relative z-10 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="eyebrow text-primary"
          >
            {languageStore.t('home.eyebrow')}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="heading-display mt-5 max-w-3xl"
          >
            {languageStore.t('home.heading')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="prose-muted mt-6 max-w-xl text-base sm:text-lg"
          >
            {languageStore.t('home.intro')}
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navbarStore.scrollTo('about-hero')}
              className="interactive-lift inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              {languageStore.t('home.explore')} <ArrowDown size={16} aria-hidden="true" />
            </button>
            <a
              className="interactive-lift inline-flex min-h-11 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-foreground"
              href="https://github.com/WuttichaiSukantho"
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiGithub size={17} aria-hidden="true" /> {languageStore.t('home.github')}
            </a>
            <ShareButton />
            <a
              className="interactive-lift inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
              href="https://www.linkedin.com/in/wuttichai-sukantho-0939b1241/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={languageStore.t('home.followLabel')}
            >
              <UserPlus size={17} aria-hidden="true" /> {languageStore.t('home.follow')}
            </a>
          </div>
          <div className="mt-5">
            <div className="flex min-h-28 min-w-0 w-full flex-col gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#0a66c2] text-white shadow-[0_0_18px_rgba(10,102,194,0.35)]">
                  <FaLinkedinIn size={17} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    Wuttichai Sukantho
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 border-t border-white/10 pt-2 sm:grid-cols-4">
                {profileLinks.map((profile) => {
                  const { label, handle, href, Icon } = profile;
                  const accent = 'accent' in profile ? profile.accent : undefined;

                  return (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label}: ${handle}`}
                      title={`${label}: ${handle}`}
                      className={`flex min-w-0 items-center gap-2 rounded-lg px-1.5 py-1.5 text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${accent === 'spotify' ? 'hover:bg-[#1ed760]/10 hover:text-[#1ed760]' : 'hover:bg-white/10 hover:text-primary'}`}
                    >
                      <Icon
                        size={14}
                        className={`shrink-0 ${accent === 'spotify' ? 'text-[#1ed760]' : ''}`}
                        aria-hidden="true"
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.65rem] font-semibold text-foreground">
                          {label}
                        </span>
                        <span className="block truncate text-[0.58rem]">{handle}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Code2 size={15} className="text-primary" aria-hidden="true" />{' '}
              {languageStore.t('home.workflow')}
            </span>
            <span>{languageStore.t('home.interactive')}</span>
            <span className="font-semibold tracking-[0.12em] text-primary/80">
              {languageStore.t('home.warning')}
            </span>
          </div>
        </div>
        <motion.div
          animate={profileAnimation}
          transition={profileTransition}
          className="relative mx-auto w-full max-w-sm lg:max-w-md"
        >
          <div className="surface-strong relative overflow-hidden p-2 sm:p-3">
            <img
              src="/wuttichai.github.io/profile/wuttichai-sukantho.png"
              width={520}
              height={620}
              fetchPriority="high"
              alt="Full-body portrait of Wuttichai Sukantho"
              className="h-auto max-h-[620px] w-full rounded-lg object-contain"
            />
            <div className="mt-3 rounded-lg border border-white/15 bg-black/55 p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                {languageStore.t('home.focusLabel')}
              </p>
              <p className="mt-1 text-sm text-foreground">{languageStore.t('home.focus')}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
const homeSection = new HomeSectionClass();
export const HomeSection = observer(homeSection.render);
