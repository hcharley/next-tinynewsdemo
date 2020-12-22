import ArticleHeader from './articles/ArticleHeader';
import ArticleBody from './articles/ArticleBody';
import Comments from './articles/Comments';
import ArticleFooter from './articles/ArticleFooter';
import Recirculation from './articles/Recirculation';
import { useAmp } from 'next/amp';
import Layout from './Layout.js';

export default function Article({
  article,
  currentLocale,
  sections,
  ads,
  siteMetadata,
  sectionArticles,
}) {
  const isAmp = useAmp();

  return (
    <Layout
      meta={siteMetadata}
      locale={currentLocale}
      article={article}
      sections={sections}
    >
      <div className="post">
        <ArticleHeader article={article} isAmp={isAmp} locale={currentLocale} />
        <section className="section post__body rich-text" key="body">
          <ArticleBody
            article={article}
            isAmp={isAmp}
            ads={ads}
            locale={currentLocale}
          />
          <ArticleFooter
            article={article}
            isAmp={isAmp}
            locale={currentLocale}
          />
        </section>
        <Comments article={article} isAmp={isAmp} />
        <Recirculation
          articles={sectionArticles}
          isAmp={isAmp}
          locale={currentLocale}
          siteMetadata={siteMetadata}
          section={article.category}
        />
      </div>
    </Layout>
  );
}
