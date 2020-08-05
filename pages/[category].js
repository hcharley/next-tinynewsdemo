import Layout from '../components/Layout.js';
import ArticleLink from '../components/homepage/ArticleLink.js';
import {
  listAllArticlesBySection,
  listAllSectionTitles,
} from '../lib/articles.js';
import { siteMetadata } from '../lib/siteMetadata.js';
import ArticleNav from '../components/nav/ArticleNav.js';
import ArticleFooter from '../components/nav/ArticleFooter.js';
import { useAmp } from 'next/amp';

export default function CategoryPage(props) {
  const isAmp = useAmp();
  return (
    <Layout meta={siteMetadata}>
      <ArticleNav metadata={siteMetadata} sections={sections} />
      <section className="section">
        <h1 className="title">{props.title}</h1>
        <div className="columns">
          <div className="column is-four-fifths">
            {props.articles.map((article) => (
              <ArticleLink key={article.id} article={article} amp={isAmp} />
            ))}
          </div>
        </div>
      </section>
      <ArticleFooter metadata={siteMetadata} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await listAllSectionTitles();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const articles = await listAllArticlesBySection(params.category);
  const title = params.category;
  return {
    props: {
      articles,
      title,
    },
  };
}
