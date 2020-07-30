import Layout from '../../../components/Layout.js';
import Link from 'next/link';
import kebabCase from 'lodash/kebabCase';
import {
  getArticleBySlug,
  listAllArticleSlugs,
} from '../../../lib/articles.js';
import ArticleNav from '../../../components/nav/ArticleNav.js';
import ArticleFooter from '../../../components/nav/ArticleFooter.js';
import Coral from '../../../components/plugins/Coral.js';
import MailchimpSubscribe from '../../../components/plugins/MailchimpSubscribe.js';
import EmbedNode from '../../../components/nodes/EmbedNode.js';
import ImageNode from '../../../components/nodes/ImageNode.js';
import ListNode from '../../../components/nodes/ListNode.js';
import TextNode from '../../../components/nodes/TextNode.js';
import { useAmp } from 'next/amp';
import { parseISO } from 'date-fns';
import { siteMetadata } from '../../../lib/siteMetadata.js';

let sections = [
  { label: 'News', link: '/news' },
  { label: 'Features', link: '/features' },
  { label: 'Pandemic', link: '/pandemic' },
];

export const config = { amp: 'hybrid' };

export default function Article({ article }) {
  const mainImageNode = article.body.find((node) => node.type === 'mainImage');
  let mainImage = null;

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }

  siteMetadata.searchTitle = article.searchTitle;
  siteMetadata.searchDescription = article.searchDescription;
  siteMetadata.facebookTitle = article.facebookTitle;
  siteMetadata.facebookDescription = article.facebookDescription;
  siteMetadata.twitterTitle = article.twitterTitle;
  siteMetadata.twitterDescription = article.twitterDescription;
  siteMetadata.tags = article.tags;
  siteMetadata.firstPublishedOn = article.firstPublishedOn;
  siteMetadata.lastPublishedOn = article.lastPublishedOn;
  siteMetadata.coverImage = mainImage.imageUrl;

  const isAmp = useAmp();

  const serialize = (node) => {
    switch (node.type) {
      case 'list':
        return <ListNode node={node} />;
      case 'text':
        return <TextNode node={node} />;
      case 'paragraph':
        return <TextNode node={node} />;
      case 'image':
        return <ImageNode node={node} amp={isAmp} />;
      case 'embed':
        return <EmbedNode node={node} amp={isAmp} />;
      default:
        return null;
    }
  };

  const serializedBody = article.body.map((node, i) => serialize(node, i));

  let tagLinks;
  if (article.tags) {
    tagLinks = article.tags.map((tag, index) => (
      <Link
        href={`/topics/${kebabCase(tag.title)}`}
        key={`${tag.title}-${index}`}
      >
        <a className="is-link tag">{tag.title}</a>
      </Link>
    ));
  }

  var Dateline = require('dateline');
  let parsedDate = parseISO(article.firstPublishedOn);
  let firstPublishedOn =
    Dateline(parsedDate).getAPDate() +
    ' at ' +
    Dateline(parsedDate).getAPTime();
  parsedDate = parseISO(article.lastPublishedOn);
  let lastPublishedOn =
    Dateline(parsedDate).getAPDate() +
    ' at ' +
    Dateline(parsedDate).getAPTime();

  return (
    <Layout meta={siteMetadata}>
      <ArticleNav metadata={siteMetadata} sections={sections} />
      <article>
        <section className="hero is-bold">
          <div className="hero-body">
            <div
              className={article.cover ? 'container head-margin' : 'container'}
            >
              <h1 className="title is-size-1">{article.headline}</h1>
              <h2 className="subtitle">
                By {article.byline} | Published {firstPublishedOn}
              </h2>
              <h2 className="subtitle">Last updated: {lastPublishedOn}</h2>
            </div>
          </div>
        </section>
        {mainImage && (
          <img
            src={mainImage.imageUrl}
            alt={mainImage.imageAlt}
            className="image"
          />
        )}
        <section className="section">
          <div id="articleText" className="content">
            {serializedBody}
          </div>
        </section>
      </article>
      <aside>
        <section className="section">
          <div className="align-content">
            {tagLinks && <p className="subtitle">Tags</p>}
            <div className="tags">{tagLinks}</div>
          </div>
        </section>
      </aside>
      <section className="section">
        <div className="align-content medium-margin-top">
          <h1 className="title media-left">
            {siteMetadata.subscribe.subtitle}
          </h1>
          <MailchimpSubscribe />
          <div className="comments">
            {isAmp ? (
              <div>Coral AMP</div>
            ) : (
              <Coral storyURL={`/articles/${article.id}`} />
            )}
          </div>
        </div>
      </section>
      <ArticleFooter metadata={siteMetadata} />
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await listAllArticleSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const article = await getArticleBySlug(params.slug);

  return {
    props: {
      article,
    },
  };
}