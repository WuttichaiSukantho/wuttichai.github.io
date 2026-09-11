import { CookieConsent } from '@components/cookie-consent';
import { Flower } from '@components/flower';
import { Layout } from '@components/Layout';
import { getSiteUrl, siteConfig } from '@domain/site/site-config';
import { createStructuredData } from '@lib/seo/structured-data';
import { languageStore } from '@store/language-store';
import { HeadContent, Outlet, Scripts, useRouterState } from '@tanstack/react-router';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { Component } from 'react';

import { InitialLoader } from './initial-loader';

interface RootComponentProps {
  pathname: string;
  language: 'en' | 'th';
}

class RootComponentClass extends Component<RootComponentProps> {
  override componentDidMount(): void {
    languageStore.init();
  }

  override render() {
    const { pathname, language } = this.props;
    const title = siteConfig.title;
    const description = language === 'th' ? siteConfig.thaiDescription : siteConfig.description;
    const canonicalUrl = getSiteUrl();
    const openGraphImage = getSiteUrl(siteConfig.openGraphImage);
    const structuredData = createStructuredData(language);

    const animation = {
      initial: {
        opacity: 0,
        y: 16,
      },
      animate: {
        opacity: 1,
        y: 0,
      },
      exit: {
        opacity: 0,
        y: -16,
      },
      transition: {
        duration: 0.28,
        ease: 'easeOut' as const,
      },
    };

    return (
      <html lang={language}>
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="canonical" href={canonicalUrl} />
          <link rel="icon" href="/wuttichai.github.io/favicon.ico" sizes="48x48" />
          <link rel="apple-touch-icon" href={getSiteUrl(siteConfig.logo)} />
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
          <meta name="author" content={siteConfig.name} />

          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:site_name" content={siteConfig.name} />
          <meta
            property="og:locale"
            content={language === 'th' ? siteConfig.alternateLocale : siteConfig.locale}
          />
          <meta property="og:image" content={openGraphImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/png" />
          <meta
            property="og:image:alt"
            content={`${siteConfig.name} (${siteConfig.nickname}) — ${siteConfig.jobTitle}`}
          />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={canonicalUrl} />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={openGraphImage} />
          <meta name="twitter:image:alt" content={`${siteConfig.name} — ${siteConfig.jobTitle}`} />
          <meta name="theme-color" content="#09090b" />

          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>

          <HeadContent />
        </head>

        <body>
          <MotionConfig reducedMotion="user">
            <InitialLoader />

            <div className="relative flex min-h-screen flex-col">
              <Flower />

              <Layout>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={animation.initial}
                    animate={animation.animate}
                    exit={animation.exit}
                    transition={animation.transition}
                    className="relative z-10 w-full flex-1"
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </Layout>
            </div>

            <CookieConsent />
          </MotionConfig>
          <Scripts />
        </body>
      </html>
    );
  }
}

const RootComponentObserver = observer(function RootComponentObserver() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const language = languageStore.language;

  return <RootComponentClass pathname={pathname} language={language} />;
});

export const RootComponent = RootComponentObserver;
