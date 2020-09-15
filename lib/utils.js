import Link from 'next/link';
import { apdate, aptime } from 'journalize';
import EmbedNode from '../components/nodes/EmbedNode.js';
import ImageNode from '../components/nodes/ImageNode.js';
import ListNode from '../components/nodes/ListNode.js';
import TextNode from '../components/nodes/TextNode.js';
import ImageWithTextAd from '../components/ads/ImageWithTextAd.js';

export const renderAuthor = (author, i) => {
  if (author.slug !== null && author.slug !== undefined) {
    return (
      <Link href={`/authors/${author.slug}`} key={`${author.slug}-${i}`}>
        <a className="is-link">{author.name}</a>
      </Link>
    );
  } else {
    return (
      <span className="author" key={author.id}>
        {author.name}
      </span>
    );
  }
};

// solution that works with react elements from https://codepen.io/pascalpp/pen/MKRwjP
export const renderAuthors = (article) => {
  // first cover a byline-only article
  if (!article.authors && article.byline) {
    return article.byline;
  }

  const authors = article.authors.map(renderAuthor);

  var output = [];
  authors.forEach(function (author, i) {
    // if list is more than one item and this is the last item, prefix with 'and '
    if (authors.length > 1 && i === authors.length - 1) output.push('and ');
    // output the item
    output.push(author);
    // if list is more than 2 items, append a comma to all but the last item
    if (authors.length > 2 && i < authors.length - 1) output.push(',');
    // if list is more than 1 item, append a space to all but the last item
    if (authors.length > 1 && i < authors.length - 1) output.push(' ');
  });

  return output;
};

export const renderDate = (isoDate, renderTime = true) => {
  const parsed = new Date(isoDate);
  if (renderTime) {
    return `${apdate(parsed)} at ${aptime(parsed)}`;
  } else {
    return apdate(parsed);
  }
};

export const renderBody = (article, isAmp) => {
  const ad_placement = 5;
  let adComponent = (
    <ImageWithTextAd
      ad={{
        brand: 'test',
        image: {
          url: 'https://placehold.it/300x300',
          alt: 'Alt text',
        },
        header: 'test header',
        body: 'This is the body text of an advertisement.',
        call: 'Call to action',
        url: 'https://www.w3schools.com/',
      }}
    />
  );

  const serialize = (node, i) => {
    if (i != ad_placement) {
      switch (node.type) {
        case 'list':
          return <ListNode node={node} key={i} />;
        case 'text':
          return <TextNode node={node} key={i} />;
        case 'paragraph':
          return <TextNode node={node} key={i} />;
        case 'image':
          return <ImageNode node={node} amp={isAmp} key={i} />;
        case 'embed':
          return <EmbedNode node={node} amp={isAmp} key={i} />;
        default:
          return null;
      }
    } else {
      switch (node.type) {
        case 'list':
          return [<ListNode node={node} key={i} />, adComponent];
        case 'text':
          return [<TextNode node={node} key={i} />, adComponent];
        case 'paragraph':
          return [<TextNode node={node} key={i} />, adComponent];
        case 'image':
          return [<ImageNode node={node} amp={isAmp} key={i} />, adComponent];
        case 'embed':
          return [<EmbedNode node={node} amp={isAmp} key={i} />, adComponent];
        default:
          return null;
      }
    }
  };

  return article.content.map((node, i) => serialize(node, i));
};