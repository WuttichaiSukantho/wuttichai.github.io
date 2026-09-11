import { siteConfig } from '@domain/site/site-config';

import { educationItems, experienceItems, professionalSkills, skills } from './profile-content';

export interface ProfileStat {
  readonly key:
    | 'profileStats.experience'
    | 'profileStats.education'
    | 'profileStats.focusTechnologies'
    | 'profileStats.professionalSkills'
    | 'profileStats.publicProfiles';
  readonly value: number;
}

export interface ProfileGraphDatum {
  readonly label: string;
  readonly value: number;
}

export const profileStats: readonly ProfileStat[] = [
  { key: 'profileStats.experience', value: experienceItems.length },
  { key: 'profileStats.education', value: educationItems.length },
  { key: 'profileStats.focusTechnologies', value: skills.length },
  { key: 'profileStats.professionalSkills', value: professionalSkills.length },
  { key: 'profileStats.publicProfiles', value: siteConfig.sameAs.length },
];

export const profileStatsMaximum = Math.max(...profileStats.map((stat) => stat.value));

const experienceStartYearCounts = new Map<string, number>();

for (const experience of experienceItems) {
  const startYear = experience.startDate.slice(0, 4);
  experienceStartYearCounts.set(startYear, (experienceStartYearCounts.get(startYear) ?? 0) + 1);
}

export const experienceStartYearStats: readonly ProfileGraphDatum[] = [...experienceStartYearCounts]
  .sort(([firstYear], [secondYear]) => firstYear.localeCompare(secondYear))
  .map(([label, value]) => ({ label, value }));

export const experienceStartYearMaximum = Math.max(
  ...experienceStartYearStats.map((stat) => stat.value),
);
