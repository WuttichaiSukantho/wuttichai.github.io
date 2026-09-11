import { profileIdentity } from '@domain/profile/profile-identity';

export const siteConfig = {
  name: profileIdentity.canonicalName,
  nickname: profileIdentity.nickname,
  alternateNames: profileIdentity.alternateNames,
  title: 'Wuttichai Sukantho (Bomb) — Software Developer',
  description:
    'Portfolio of Wuttichai Sukantho (วุฒิชัย สุคันโซ), also known as Bomb, featuring software development work, projects, experience, and technical skills.',
  thaiDescription:
    'พอร์ตโฟลิโอของวุฒิชัย สุคันโซ (Wuttichai Sukantho) หรือ Bomb นักพัฒนาซอฟต์แวร์ที่นำเสนอผลงาน ประสบการณ์ และทักษะด้านเทคโนโลยี',
  url: 'https://wuttichaisukantho.github.io/wuttichai.github.io',
  locale: 'en_US',
  alternateLocale: 'th_TH',
  jobTitle: 'Software Developer',
  image: '/image/profile/profile-photo.webp',
  logo: '/engin.ico',
  openGraphImage: '/og-image.png',
  knowsAbout: [
    'TypeScript',
    'Bun',
    'Elysia',
    'PostgreSQL',
    'Prisma',
    'Redis',
    'Docker',
    'React',
    'Backend development',
    'API engineering',
    'System architecture',
  ],
  sameAs: [
    'https://github.com/WuttichaiSukantho',
    'https://www.linkedin.com/in/wuttichai-sukantho-0939b1241/',
    'https://www.facebook.com/WuttichaiSukantho/',
    'https://www.instagram.com/wuttichaisukantho/',
    'https://www.youtube.com/channel/UCaXiIq_Vs-h94xb-CIW7JUg',
    'https://twitter.com/Wuttichai_WS',
    'https://open.spotify.com/user/31m7xrvae43ro2et7rn2mcayuoke',
    'https://th.jobsdb.com/profiles/วุฒิชัย-สุคันโฑ-2vytXlpx0N',
  ],
  employer: 'M BIZ CONSULTANT CO., LTD.',
  alumniOf: 'Rajamangala University of Technology Srivijaya',
} as const;

export type SiteLanguage = 'en' | 'th';

export function getSiteUrl(path = ''): string {
  return `${siteConfig.url}${path}`;
}
