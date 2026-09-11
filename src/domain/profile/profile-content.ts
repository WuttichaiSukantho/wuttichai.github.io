export interface EducationItem {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly title: string;
  readonly subtitle?: string;
  readonly description: string;
  readonly period?: string;
}

export const skills = [
  'TypeScript',
  'Bun',
  'Elysia',
  'PostgreSQL',
  'Prisma',
  'Redis',
  'Docker',
] as const;

type ExperienceIndex = 0 | 1 | 2 | 3 | 4 | 5;

export interface ExperienceItem {
  readonly company: string;
  readonly role: string;
  readonly periodKey: `experience.${ExperienceIndex}.period`;
  readonly descriptionKey: `experience.${ExperienceIndex}.description`;
  readonly startDate: string;
  readonly endDate?: string;
  readonly employmentKey?: `experience.${ExperienceIndex}.employment`;
  readonly locationKey?: `experience.${ExperienceIndex}.location`;
}

export const experienceItems: readonly ExperienceItem[] = [
  {
    company: 'M Biz Consultant Co., Ltd.',
    role: 'Software Developer',
    periodKey: 'experience.0.period',
    descriptionKey: 'experience.0.description',
    startDate: '2025-01',
    employmentKey: 'experience.0.employment',
    locationKey: 'experience.0.location',
  },
  {
    company: 'ADot',
    role: 'Software Developer',
    periodKey: 'experience.1.period',
    descriptionKey: 'experience.1.description',
    startDate: '2023-07',
    endDate: '2023-10',
    employmentKey: 'experience.1.employment',
    locationKey: 'experience.1.location',
  },
  {
    company: 'M Biz Consultant Co., Ltd.',
    role: 'Software Developer',
    periodKey: 'experience.5.period',
    descriptionKey: 'experience.5.description',
    startDate: '2024-05',
    endDate: '2024-12',
    employmentKey: 'experience.5.employment',
    locationKey: 'experience.5.location',
  },
  {
    company: 'Rmutsv',
    role: 'University Student',
    periodKey: 'experience.2.period',
    descriptionKey: 'experience.2.description',
    startDate: '2020-01',
    endDate: '2024-12',
    employmentKey: 'experience.2.employment',
    locationKey: 'experience.2.location',
  },
  {
    company: 'Stream South Technology',
    role: 'Developer',
    periodKey: 'experience.3.period',
    descriptionKey: 'experience.3.description',
    startDate: '2019-03',
    endDate: '2019-05',
    employmentKey: 'experience.3.employment',
    locationKey: 'experience.3.location',
  },
  {
    company: 'Isuzu Hatyai Co., Ltd.',
    role: 'Summer Internship',
    periodKey: 'experience.4.period',
    descriptionKey: 'experience.4.description',
    startDate: '2019-03',
    endDate: '2019-05',
    employmentKey: 'experience.4.employment',
    locationKey: 'experience.4.location',
  },
];

export const professionalSkills = [
  'GitHub',
  'CI/CD',
  'PostgreSQL',
  'MongoDB',
  'Node.js',
  'React Front-End Development',
  'Redis',
  'REST API',
  'TypeScript',
  'Software Development',
  'API',
  'JavaScript',
  'Web Applications',
  'Express.js',
  'Backend Programming',
] as const;

export const educationItems: readonly EducationItem[] = [
  {
    src: '/wuttichai.github.io/image/education/primary-school.webp',
    width: 514,
    height: 123,
    title: 'Primary School',
    subtitle: 'Foundational learning',
    description:
      'This was the starting point of my lifelong educational journey. During these formative years, I naturally developed a deep curiosity about how things operate, a sense of wonder for technology, and a persistent eagerness to acquire new knowledge.',
    period: 'Early foundations',
  },
  {
    src: '/wuttichai.github.io/image/education/secondary-school.webp',
    width: 1200,
    height: 200,
    title: 'Secondary School',
    subtitle: 'Exploration and discovery',
    description:
      'In secondary school, my fascination evolved into a serious interest in computers and digital systems. This pivotal phase marked my first steps into exploring fundamental programming principles, logic structuring, and practical problem-solving approaches.',
    period: 'Discovery phase',
  },
  {
    src: '/wuttichai.github.io/image/education/vocational-school.webp',
    width: 160,
    height: 55,
    title: 'Vocational Certificate',
    subtitle: 'Business Administration (Computer Information)',
    description:
      'During my vocational education, I bridged the gap between business structures and technology by specializing in computer information systems. This phase firmly strengthened my proficiency in database structures, software applications, and aligning technical execution with practical commercial environments.',
    period: 'Technical specialization',
  },
  {
    src: '/wuttichai.github.io/image/brand/university-logo.webp',
    width: 1200,
    height: 400,
    title: 'University Degree',
    subtitle: 'Information Technology and Software Engineering',
    description:
      'At the university level, my focus narrowed down entirely to advanced software development, distributed architectures, and modern web engineering paradigms. I gained profound hands-on experience building production-ready applications, structuring high-performance backend layers, and mastering real-world software engineering life cycles.',
    period: 'Professional engineering',
  },
];
