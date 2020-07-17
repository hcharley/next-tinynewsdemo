import _ from 'lodash';
import Link from 'next/link';
import { listAllArticles } from '../lib/articles.js';
import Layout from '../components/Layout.js';
import ArticleNav from '../components/nav/ArticleNav.js';
import FeaturedArticleLink from '../components/homepage/FeaturedArticleLink.js';
import ArticleLink from '../components/homepage/ArticleLink.js';
import ArticleFooter from '../components/nav/ArticleFooter.js';
// import HomepageSearchPanel from '../components/homepage/HomepageSearchPanel.js'
import { useAmp } from 'next/amp';

let siteMetadata = {
  title: 'Tiny News Collective',
  shortName: 'Tiny News',
  description: 'A local news site',
  labels: { topics: 'Topics' },
  nav: { topics: 'All Topics', cms: 'tinycms' },
  search: 'Search',
  footerTitle: 'tinynewsco.org',
  footerBylineLink: 'https://newscatalyst.org/',
  footerBylineName: 'News Catalyst',
};
let tags = ['Coronavirus', 'Police Violence', '2020 Election'];
let sections = [
  { label: 'News', link: '/news' },
  { label: 'Features', link: '/features' },
  { label: 'Pandemic', link: '/pandemic' },
];

export const config = { amp: 'hybrid' };

export default function Home({ articles }) {
  const isAmp = useAmp();

  let featuredArticles = articles.slice(0, 1);
  let unfeaturedArticles = articles.slice(1);

  const tagLinks = tags.map((tag) => (
    <Link key={tag} href={`/topics/${tag}`}>
      <a className="panel-block is-active">{_.startCase(tag)}</a>
    </Link>
  ));

  return (
    <div className="homepage">
      <ArticleNav metadata={siteMetadata} tags={tags} sections={sections} />
      <Layout meta={siteMetadata}>
        <section className="hero is-dark is-bold">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">{siteMetadata.title}</h1>
              <h2 className="subtitle">{siteMetadata.description}</h2>
            </div>
          </div>
        </section>
        <div className="featured-article">
          {featuredArticles.map((featuredArticle) => (
            <FeaturedArticleLink
              key={featuredArticle.id}
              article={featuredArticle}
              amp={isAmp}
            />
          ))}
        </div>
        <section className="section">
          <div className="columns">
            <div className="column is-four-fifths">
              {unfeaturedArticles.map((unfeaturedArticle) => (
                <ArticleLink
                  key={unfeaturedArticle.id}
                  article={unfeaturedArticle}
                  amp={isAmp}
                />
              ))}
            </div>
            <div className="column">
              {/* <HomepageSearchPanel metadata={siteMetadata} query={query} setQuery={setQuery} /> */}
              <nav className="panel">
                <p className="panel-heading">{siteMetadata.labels.topics}</p>
                {tagLinks}
              </nav>
            </div>
          </div>
        </section>
      </Layout>
      <ArticleFooter post_type="home" metadata={siteMetadata} />
    </div>
  );
}

export async function getStaticProps() {
  const articles = await listAllArticles();

  return {
    props: {
      articles,
    },
  };
}
