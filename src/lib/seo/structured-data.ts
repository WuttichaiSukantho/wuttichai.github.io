import { getSiteUrl, siteConfig, type SiteLanguage } from '@domain/site/site-config';

export function createStructuredData(language: SiteLanguage) {
  const description = language === 'th' ? siteConfig.thaiDescription : siteConfig.description;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        name: siteConfig.name,
        url: siteConfig.url,
        description,
        inLanguage: language,
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteConfig.url}/#profile-page`,
        name: siteConfig.title,
        url: siteConfig.url,
        description,
        isPartOf: { '@id': `${siteConfig.url}/#website` },
        about: { '@id': `${siteConfig.url}/#person` },
        mainEntity: { '@id': `${siteConfig.url}/#person` },
        inLanguage: language,
      },
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}/#person`,
        name: siteConfig.name,
        alternateName: siteConfig.alternateNames,
        url: siteConfig.url,
        image: getSiteUrl(siteConfig.image),
        jobTitle: siteConfig.jobTitle,
        worksFor: {
          '@type': 'Organization',
          name: siteConfig.employer,
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: siteConfig.alumniOf,
        },
        knowsAbout: siteConfig.knowsAbout,
        sameAs: siteConfig.sameAs,
      },
    ],
  } as const;
}
