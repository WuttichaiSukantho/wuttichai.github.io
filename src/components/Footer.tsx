import { Section } from '@components/section';
import type { TranslationKey } from '@domain/i18n/translations';
import { languageStore } from '@store/language-store';
import { ArrowUpRight, BriefcaseBusiness } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import type { IconType } from 'react-icons';
import { FaLinkedinIn } from 'react-icons/fa';
import { SiFacebook, SiGithub, SiInstagram, SiSpotify, SiX, SiYoutube } from 'react-icons/si';

class Social {
  constructor(
    readonly href: string,
    readonly name: string,
    readonly description: TranslationKey,
    readonly Icon: IconType,
    readonly src?: string,
  ) {}
}
const socials = [
  new Social(
    'https://github.com/WuttichaiSukantho',
    'GitHub',
    'footer.social.github',
    SiGithub,
    '/wuttichai.github.io/image/social/github.webp',
  ),
  new Social(
    'https://www.linkedin.com/in/wuttichai-sukantho-0939b1241/',
    'LinkedIn',
    'footer.social.linkedin',
    FaLinkedinIn,
    '/wuttichai.github.io/image/social/linkedin.webp',
  ),
  new Social(
    'https://www.facebook.com/WuttichaiSukantho/',
    'Facebook',
    'footer.social.facebook',
    SiFacebook,
    '/wuttichai.github.io/image/social/facebook.webp',
  ),
  new Social(
    'https://www.instagram.com/wuttichaisukantho/',
    'Instagram',
    'footer.social.instagram',
    SiInstagram,
    '/wuttichai.github.io/image/social/instagram.webp',
  ),
  new Social(
    'https://www.youtube.com/channel/UCaXiIq_Vs-h94xb-CIW7JUg',
    'YouTube',
    'footer.social.youtube',
    SiYoutube,
    '/wuttichai.github.io/image/social/youtube.webp',
  ),
  new Social(
    'https://twitter.com/Wuttichai_WS',
    'X',
    'footer.social.x',
    SiX,
    '/wuttichai.github.io/image/social/x.webp',
  ),
  new Social(
    'https://open.spotify.com/user/31m7xrvae43ro2et7rn2mcayuoke',
    'Spotify',
    'footer.social.spotify',
    SiSpotify,
    '/wuttichai.github.io/image/social/spotify.webp',
  ),
  new Social(
    'https://th.jobsdb.com/profiles/วุฒิชัย-สุคันโฑ-2vytXlpx0N',
    'JobsDB',
    'footer.social.jobsdb',
    BriefcaseBusiness,
  ),
] as const;
export const Footer = observer(() => (
  <Section id="contact" className="!min-h-0 border-t border-white/10 bg-black/10">
    <footer className="container-responsive section-pad">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
        <div className="max-w-md">
          <p className="eyebrow text-primary">{languageStore.t('footer.eyebrow')}</p>
          <h2 className="heading-section mt-4">{languageStore.t('footer.heading')}</h2>
          <p className="prose-muted mt-4 max-w-sm">{languageStore.t('footer.description')}</p>
          <a
            className="interactive-lift mt-7 inline-flex min-h-11 items-center gap-2 rounded-lg border border-primary/40 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            href="https://www.linkedin.com/in/wuttichai-sukantho-0939b1241/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {languageStore.t('footer.cta')} <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
        <nav
          aria-label={languageStore.t('footer.eyebrow')}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
        >
          {socials.map(({ href, name, description, Icon, src }) => (
            <a
              key={href}
              className="interactive-lift glass-card group flex min-h-24 flex-col justify-between gap-4 p-4 focus-visible:outline-none"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="flex items-center justify-between text-primary">
                {src ? (
                  <img
                    src={src}
                    alt=""
                    width="20"
                    height="20"
                    loading="lazy"
                    decoding="async"
                    className="object-contain"
                  />
                ) : (
                  <Icon size={20} aria-hidden="true" />
                )}
                <ArrowUpRight size={15} className="opacity-50" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-foreground">{name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {languageStore.t(description)}
                </span>
              </span>
            </a>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Wuttichai Sukantho</p>
        <p>{languageStore.t('footer.stack')}</p>
      </div>
    </footer>
  </Section>
));
