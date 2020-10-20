import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';

const CONTENT_DELIVERY_API_URL = process.env.CONTENT_DELIVERY_API_URL;
const CONTENT_DELIVERY_API_ACCESS_TOKEN =
  process.env.CONTENT_DELIVERY_API_ACCESS_TOKEN;

const CREATE_CATEGORY = `mutation CreateCategory($data: CategoryInput!) {
  categories {
      createCategory(data: $data) {
        data {
          id
          title {
            values {
              value                
              locale
            }
          }
          slug
        }
        error  {
          code
          message
          data
        }
      }
  }
}`;

export async function createCategory(url, token, localeID, title, slug) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    data: {
      slug: slug,
      title: {
        values: [
          {
            value: title,
            locale: localeID,
          },
        ],
      },
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    CREATE_CATEGORY,
    variables
  );
  return responseData;
}

const LIST_CATEGORIES = `{
  categories {
    listCategories {
      data {
        id
        slug
        title {
          values {
            value
            locale
          }
        }
      }
    }
  }
}`;

export async function listCategoryIds() {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const sectionsData = await webinyHeadlessCms.request(LIST_CATEGORIES);

  const sections = sectionsData.categories.listCategories.data.map(
    (section) => {
      return {
        params: {
          id: section.id,
        },
      };
    }
  );
  return sections;
}

const UPDATE_CATEGORY = `mutation UpdateCategory($id: ID!, $data: CategoryInput!) {
  categories {
    updateCategory(id: $id, data: $data) {
      data {
        id
        title {
          values {
            value
          }
        }
        slug
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

export async function updateCategory(
  url,
  token,
  localeID,
  categoryID,
  title,
  slug
) {
  const webinyHeadlessCms = new GraphQLClient(url, {
    headers: {
      authorization: token,
    },
  });

  const variables = {
    id: categoryID,
    data: {
      slug: slug,
      title: {
        values: [
          {
            value: title,
            locale: localeID,
          },
        ],
      },
      published: true,
    },
  };

  const responseData = await webinyHeadlessCms.request(
    UPDATE_CATEGORY,
    variables
  );
  return responseData;
}

const GET_CATEGORY = `query GetCategory($id: ID!) {
  categories {
    getCategory(id: $id) {
      data {
        id
        title {
          values {
            value
          }
        }
        slug
      }
      error {
        code
        data
        message
      }
    }
  }
}`;

export async function getCategory(id) {
  const webinyHeadlessCms = new GraphQLClient(CONTENT_DELIVERY_API_URL, {
    headers: {
      authorization: CONTENT_DELIVERY_API_ACCESS_TOKEN,
    },
  });

  const variables = {
    id: id,
  };

  const responseData = await webinyHeadlessCms.request(GET_CATEGORY, variables);

  return responseData.categories.getCategory.data;
}