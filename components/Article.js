import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments';
import ArticleFooter from './articles/ArticleFooter';
import Recirculation from './articles/Recirculation';
import { generateArticleUrl } from '../lib/utils.js';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({
  article,
  sections,
  ads,
  siteMetadata,
  sectionArticles,
}) {
  const isAmp = useAmp();

  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMetadata['siteUrl'];
  // this is used for the canonical link tag in the Layout component
  let canonicalArticleUrl = generateArticleUrl(baseUrl, article);
  siteMetadata['canonicalUrl'] = canonicalArticleUrl;

  return (
    <Layout meta={siteMetadata} article={article} sections={sections}>
      <div className="post">
        <ArticleHeader
          article={article}
          isAmp={isAmp}
          metadata={siteMetadata}
        />
        <section className="section post__body rich-text" key="body">
          <ArticleBody
            article={article}
            isAmp={isAmp}
            ads={ads}
            metadata={siteMetadata}
          />
          <ArticleFooter
            article={article}
            isAmp={isAmp}
            metadata={siteMetadata}
          />
        </section>
        <Comments article={article} isAmp={isAmp} />
        <Recirculation
          articles={sectionArticles}
          isAmp={isAmp}
          siteMetadata={siteMetadata}
          section={article.category}
        />
      </div>
    </Layout>
  );
}
