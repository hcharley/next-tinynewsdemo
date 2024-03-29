import Head from 'next/head';
import GlobalNav from '../components/nav/GlobalNav';
import GlobalFooter from './nav/GlobalFooter.js';
import { useAmp } from 'next/amp';
import AmpAnalytics from './amp/AmpAnalytics.js';
import { hasuraLocaliseText } from '../lib/utils';
import tw, { styled } from 'twin.macro';

const Main = tw.main`pt-8 pb-24`;
const ThemeWrapper = styled.div(({ meta }) => ({
  '--headingFont': meta.headingFont,
  '--bodyFont': meta.bodyFont,
  fontFamily: meta.bodyFont,
  'h1,h2,h3,h4,h5,h6': {
    'font-family': meta.headingFont,
  },
}));

export default function Layout({
  children,
  meta,
  article,
  sections,
  renderNav = true,
}) {
  if (meta === null || meta === undefined) {
    meta = {};
  }

  const metaValues = {
    canonical: meta['canonicalUrl'] || meta['siteUrl'],
    siteName: meta['shortName'],
    searchTitle: meta['searchTitle'],
    searchDescription: meta['searchDescription'],
    facebookTitle: meta['facebookTitle'],
    facebookDescription: meta['facebookDescription'],
    twitterTitle: meta['twitterTitle'],
    twitterDescription: meta['twitterDescription'],
    coverImage: meta['coverImage'],
    footerTitle: meta['footerTitle'],
    footerBylineLink: meta['footerBylineLink'],
    footerBylineName: meta['footerBylineName'],
  };
  if (article) {
    metaValues.section = hasuraLocaliseText(
      article.category.category_translations,
      'title'
    );
    metaValues.searchTitle = hasuraLocaliseText(
      article.article_translations,
      'search_title'
    );
    metaValues.searchDescription = hasuraLocaliseText(
      article.article_translations,
      'search_description'
    );
    metaValues.twitterTitle = hasuraLocaliseText(
      article.article_translations,
      'twitter_title'
    );
    metaValues.twitterDescription = hasuraLocaliseText(
      article.article_translations,
      'twitter_description'
    );
    metaValues.facebookTitle = hasuraLocaliseText(
      article.article_translations,
      'facebook_title'
    );
    metaValues.facebookDescription = hasuraLocaliseText(
      article.article_translations,
      'facebook_description'
    );
  }

  if (article && article.firstPublishedOn) {
    metaValues['firstPublishedOn'] = article.firstPublishedOn;
  }
  if (article && article.lastPublishedOn) {
    metaValues['lastPublishedOn'] = article.lastPublishedOn;
  }

  let tagList = [];
  if (article && article.tags) {
    article.tags.map((tag) => {
      tagList.push(
        <meta
          property="article:tag"
          content={hasuraLocaliseText(tag.tag_translations, 'title')}
          key={tag.slug}
        />
      );
    });
  }

  const isAmp = useAmp();

  const trackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

  return (
    <>
      <Head>
        <title>{meta['homepageTitle']}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta property="description" content={metaValues.searchDescription} />
        {tagList}
        <link rel="canonical" href={metaValues.canonical} />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:ital,wght@0,300;0,800;1,300;1,800&display=swap"
          rel="stylesheet"
        />
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@publisher_handle" />
        <meta name="twitter:title" content={metaValues.twitterTitle} />
        <meta
          name="twitter:description"
          content={metaValues.twitterDescription}
        />
        <meta name="twitter:creator" content="@author_handle" />
        <meta name="twitter:image:src" content={metaValues.coverImage} />

        {/* Facebook data */}
        <meta property="og:title" content={metaValues.facebookTitle} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={metaValues.canonical} />
        <meta property="og:image" content={metaValues.coverImage} />
        <meta
          property="og:description"
          content={metaValues.facebookDescription}
        />
        <meta property="og:site_name" content={metaValues.siteName} />
        <meta
          property="article:published_time"
          content={metaValues.firstPublishedOn}
        />
        <meta
          property="article:modified_time"
          content={metaValues.lastPublishedOn}
        />
        <meta property="article:section" content={metaValues.section} />

        {article !== undefined &&
          article.tags !== undefined &&
          article.tags.map((tag) => (
            <meta
              key={hasuraLocaliseText(tag.tag_translations, 'title')}
              property="article:tag"
              content={hasuraLocaliseText(tag.tag_translations, 'title')}
            />
          ))}
        <meta property="fb:admins" content="Facebook numeric ID" />

        <link rel="preconnect" href="https://fonts.gstatic.com" />

        {meta.theme === 'styleone' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Domine:wght@400;700&family=Libre+Franklin:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'styletwo' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Source+Serif+Pro:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'stylethree' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'stylefour' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Arbutus+Slab&family=Mulish:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}
        {meta.theme === 'stylefive' && (
          <link
            href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,wght@0,400;0,700;1,400;1,700&family=Lato:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
        )}

        {isAmp && (
          <script
            async
            custom-element="amp-analytics"
            src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"
            key="amp-analytics"
          />
        )}
      </Head>
      <ThemeWrapper meta={meta}>
        {renderNav && <GlobalNav metadata={meta} sections={sections} />}
        <Main>
          {isAmp && (
            <AmpAnalytics
              type="googleanalytics"
              script={{
                vars: {
                  account: trackingId,
                  gtag_id: trackingId,
                  config: {
                    [trackingId]: { groups: 'default' },
                  },
                },
                triggers: {
                  trackPageview: {
                    on: 'visible',
                    request: 'pageview',
                  },
                },
              }}
            />
          )}
          {children}
        </Main>
        <GlobalFooter metadata={metaValues} />
      </ThemeWrapper>
    </>
  );
}
