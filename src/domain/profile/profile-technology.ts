export type ProfileTechnologyGroup =
  'Frontend' | 'Runtime and tooling' | 'State and interaction' | 'UI and deployment';

export interface ProfileTechnology {
  readonly name: string;
  readonly group: ProfileTechnologyGroup;
  readonly description: {
    readonly en: string;
    readonly th: string;
  };
}

export interface ProfileBuildArea {
  readonly title: {
    readonly en: string;
    readonly th: string;
  };
  readonly description: {
    readonly en: string;
    readonly th: string;
  };
}

export const profileTechnologies: readonly ProfileTechnology[] = [
  {
    name: 'React 19',
    group: 'Frontend',
    description: {
      en: 'Component-based UI and server-rendered profile content.',
      th: 'ส่วนติดต่อผู้ใช้แบบคอมโพเนนต์และเนื้อหาโปรไฟล์ที่เรนเดอร์จากเซิร์ฟเวอร์',
    },
  },
  {
    name: 'TanStack Start',
    group: 'Frontend',
    description: {
      en: 'Application shell, routing integration, and SSR.',
      th: 'โครงสร้างแอป การเชื่อมต่อ routing และ SSR',
    },
  },
  {
    name: 'TanStack Router',
    group: 'Frontend',
    description: {
      en: 'Typed route structure and navigation lifecycle.',
      th: 'โครงสร้างเส้นทางแบบมี type และ lifecycle ของ navigation',
    },
  },
  {
    name: 'TypeScript',
    group: 'Runtime and tooling',
    description: {
      en: 'Strict types for profile data, UI, and game systems.',
      th: 'ประเภทข้อมูลแบบ strict สำหรับโปรไฟล์ UI และระบบเกม',
    },
  },
  {
    name: 'Bun',
    group: 'Runtime and tooling',
    description: {
      en: 'Project runtime and development command runner.',
      th: 'รันไทม์ของโปรเจกต์และตัวรันคำสั่งพัฒนา',
    },
  },
  {
    name: 'Vite',
    group: 'Runtime and tooling',
    description: {
      en: 'Development server and production bundling.',
      th: 'เซิร์ฟเวอร์สำหรับพัฒนาและการ bundle สำหรับ production',
    },
  },
  {
    name: 'MobX',
    group: 'State and interaction',
    description: {
      en: 'Reactive local, domain, character, and UI state.',
      th: 'สถานะ local, domain, ตัวละคร และ UI ที่ตอบสนองได้',
    },
  },
  {
    name: 'Framer Motion',
    group: 'State and interaction',
    description: {
      en: 'Accessible motion and interaction feedback.',
      th: 'แอนิเมชันและ feedback ของ interaction ที่รองรับ accessibility',
    },
  },
  {
    name: 'Tailwind CSS',
    group: 'UI and deployment',
    description: {
      en: 'Responsive visual system and theme-aware styling.',
      th: 'ระบบสไตล์ responsive ที่รองรับ theme',
    },
  },
  {
    name: 'GitHub Pages',
    group: 'UI and deployment',
    description: {
      en: 'Public hosting and deployment configuration.',
      th: 'การโฮสต์สาธารณะและการตั้งค่าสำหรับ deployment',
    },
  },
] as const;

export const profileBuildAreas: readonly ProfileBuildArea[] = [
  {
    title: {
      en: 'Server-rendered profile experiences',
      th: 'ประสบการณ์โปรไฟล์ที่เรนเดอร์จากเซิร์ฟเวอร์',
    },
    description: {
      en: 'Bilingual profile, experience, education, SEO metadata, and accessible content are available in the initial HTML.',
      th: 'โปรไฟล์สองภาษา ประสบการณ์ การศึกษา SEO metadata และเนื้อหาที่เข้าถึงได้อยู่ใน HTML ตั้งแต่เริ่มต้น',
    },
  },
  {
    title: {
      en: 'Interactive character simulation',
      th: 'การจำลองตัวละครแบบอินเทอร์แอ็กทีฟ',
    },
    description: {
      en: 'The Playground combines character movement, viewport-aware physics, items, collisions, effects, and controls.',
      th: 'Playground รวมการเคลื่อนที่ของตัวละคร ฟิสิกส์ตาม viewport ไอเทม การชน เอฟเฟกต์ และการควบคุม',
    },
  },
  {
    title: {
      en: 'Local reactive application state',
      th: 'สถานะแอปพลิเคชันแบบ reactive ภายในเครื่อง',
    },
    description: {
      en: 'MobX coordinates language, theme, navigation, character, item, and leaderboard state without a fake remote data layer.',
      th: 'MobX ดูแลภาษา ธีม navigation ตัวละคร ไอเทม และ leaderboard โดยไม่สร้าง remote data layer ปลอม',
    },
  },
] as const;
