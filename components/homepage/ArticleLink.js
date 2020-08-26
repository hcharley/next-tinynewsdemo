import React from 'react';
import Link from 'next/link';
import { parseISO } from 'date-fns';

export default function ArticleLink(props) {
  let mainImage = null;
  let parsedContent = [];
  try {
    if (typeof props.article.content === 'string') {
      parsedContent = JSON.parse(props.article.content);
    } else if (typeof props.article.content !== 'undefined') {
      // assuming it was parsed elsewhere? confusing.
      parsedContent = props.article.content;
    }
  } catch (e) {
    console.log('error parsing JSON: ', e);
  }

  const mainImageNode = parsedContent.find((node) => node.type === 'mainImage');

  var Dateline = require('dateline');
  let parsedDate = parseISO(props.article.firstPublishedOn);
  let firstPublishedOn =
    Dateline(parsedDate).getAPDate() +
    ' at ' +
    Dateline(parsedDate).getAPTime();

  if (mainImageNode) {
    mainImage = mainImageNode.children[0];
  }
  return (
    <article className="media">
      {mainImage && (
        <figure className="media-left">
          <p className="image article-link-img">
            {props.amp ? (
              <amp-img
                width={mainImage.width}
                height={mainImage.height}
                src={mainImage.imageUrl}
                alt={mainImage.imageAlt}
                layout="responsive"
              />
            ) : (
              <img src={mainImage.imageUrl} />
            )}
          </p>
        </figure>
      )}
      <div className="media-content small-margin-left">
        <div className="content">
          <h1 className="title">
            <Link
              href="/articles/[category]/[slug]"
              as={`/articles/${props.article.category.slug}/${props.article.slug}`}
            >
              <a>{props.article.headline}</a>
            </Link>
          </h1>
          <p>{props.article.excerpt}</p>
          <p>{props.article.byline}</p>
          {props.article.firstPublishedOn && <p>{firstPublishedOn}</p>}
        </div>
        <nav className="level is-mobile">
          <div className="level-left">
            <a className="level-item">
              <span className="icon is-small">
                <i className="fas fa-reply"></i>
              </span>
            </a>
            <a className="level-item">
              <span className="icon is-small">
                <i className="fas fa-retweet"></i>
              </span>
            </a>
            <a className="level-item">
              <span className="icon is-small">
                <i className="fas fa-heart"></i>
              </span>
            </a>
          </div>
        </nav>
      </div>
    </article>
  );
}
