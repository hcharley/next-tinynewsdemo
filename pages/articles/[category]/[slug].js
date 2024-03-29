import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import {
  hasuraListAllArticleSlugs,
  hasuraArticlePage,
  hasuraCategoryPage,
} from '../../../lib/articles.js';
import { hasuraLocaliseText } from '../../../lib/utils.js';
import { getArticleAds } from '../../../lib/ads.js';
import { cachedContents } from '../../../lib/cached';
import Article from '../../../components/Article.js';

export const config = { amp: 'hybrid' };

export default function ArticlePage(props) {
  const router = useRouter();

  useEffect(() => {
    if (!props.article) {
      router.push('/404');
    }
  }, [props.article, router]);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  // See: https://nextjs.org/docs/basic-features/data-fetching#the-fallback-key-required
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  // trying to fix build errors...
  if (!props.article) {
    return (
      <>
        <h1>404 Page Not Found</h1>
      </>
    );
  }
  return <Article {...props} />;
}

export async function getStaticPaths() {
  const { errors, data } = await hasuraListAllArticleSlugs();
  if (errors) {
    throw errors;
  }

  let paths = [];
  for (const article of data.articles) {
    for (const locale of article.article_translations) {
      paths.push({
        params: {
          category: article.category.slug,
          slug: article.slug,
        },
        locale: locale.locale_code,
      });
    }
  }

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ locale, params }) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;

  let article = {};
  let sectionArticles = [];
  let sections = [];
  let siteMetadata;
  const { errors, data } = await hasuraArticlePage({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: locale,
    categorySlug: params.category,
    slug: params.slug,
  });
  if (
    errors ||
    !data ||
    !data.article_slug_versions ||
    data.article_slug_versions.length === 0
  ) {
    return {
      notFound: true,
    };
    // throw errors;
  } else {
    sections = data.categories;
    for (var i = 0; i < sections.length; i++) {
      sections[i].title = hasuraLocaliseText(
        sections[i].category_translations,
        'title'
      );
    }

    article = data.article_slug_versions[0].article;
    // article = data.articles.find((a) => a.slug === params.slug);

    const sectionResponse = await hasuraCategoryPage({
      url: apiUrl,
      orgSlug: apiToken,
      categorySlug: params.category,
      localeCode: locale,
    });
    if (!sectionResponse.errors && sectionResponse.data) {
      sectionArticles = sectionResponse.data.articles.filter(
        (a) => a.slug !== params.slug
      );
    }

    let metadatas = data.site_metadatas;
    try {
      siteMetadata = metadatas[0].site_metadata_translations[0].data;
    } catch (err) {
      console.log('failed finding site metadata for ', locale, metadatas);
    }
  }

  let ads = [];
  if (process.env.LETTERHEAD_API_URL) {
    const allAds = (await cachedContents('ads', getArticleAds)) || [];
    ads = allAds.filter((ad) => ad.adTypeId === 164 && ad.status === 4);
  }

  return {
    props: {
      article,
      sections,
      ads,
      siteMetadata,
      sectionArticles,
    },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}
