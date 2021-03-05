import Link from 'next/link';
import { hasuraLocaliseText } from '../../lib/utils';
import ArticleFooterAuthor from './ArticleFooterAuthor';

export default function ArticleFooter({ article, isAmp }) {
  let tagLinks;
  if (article.tag_articles) {
    tagLinks = article.tag_articles.map((tag_article) => (
      <li key={tag_article.tag.slug}>
        <Link href={`/tags/${tag_article.tag.slug}`}>
          <a className="is-link tag">
            {hasuraLocaliseText(tag_article.tag.tag_translations, 'title')}
          </a>
        </Link>
      </li>
    ));
  }
  return (
    <div className="section post__meta post__meta--bottom">
      <div className="section__container">
        <div className="post__byline">
          {article.author_articles &&
            article.author_articles.map((authorArticle, i) => (
              <ArticleFooterAuthor
                key={authorArticle.author.slug}
                author={authorArticle.author}
                isAmp={isAmp}
                i={i}
              />
            ))}
        </div>
        <div className="post__tags">
          {tagLinks && <div className="subtitle">Read more:</div>}
          <ul className="tags">{tagLinks}</ul>
        </div>
      </div>
    </div>
  );
}
