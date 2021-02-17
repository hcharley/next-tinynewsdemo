const fetch = require("node-fetch");

const HASURA_UPSERT_METADATA = `mutation MyMutation($published: Boolean, $data: jsonb, $locale_code: String) {
  insert_site_metadatas(objects: {published: $published, site_metadata_translations: {data: {data: $data, locale_code: $locale_code}, on_conflict: {constraint: site_metadata_translations_locale_code_site_metadata_id_key, update_columns: data}}}, on_conflict: {constraint: site_metadatas_organization_id_key, update_columns: published}) {
    returning {
      id
      published
    }
  }
}`;

function hasuraUpsertMetadata(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_METADATA,
    name: 'MyMutation',
    variables: {
      data: params['data'],
      published: params['published'],
      locale_code: params['localeCode']
    },
  });
}

const HASURA_UPSERT_LAYOUT = `mutation MyMutation($name: String!, $data: jsonb!) {
  insert_homepage_layout_schemas(objects: {name: $name, data: $data}, on_conflict: {constraint: homepage_layout_schemas_name_organization_id_key, update_columns: [name, data]}) {
    returning {
      id
      name
    }
  }
}`;

function hasuraUpsertHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_LAYOUT,
    name: 'MyMutation',
    variables: {
      name: params['name'],
      data: params['data'],
    },
  });
}

const HASURA_UPSERT_SECTION = `mutation MyMutation($locale_code: String!, $title: String!, $slug: String!, $published: Boolean) {
  insert_categories(objects: {slug: $slug, category_translations: {data: {locale_code: $locale_code, title: $title}, on_conflict: {constraint: category_translations_locale_code_category_id_key, update_columns: [title]}}, published: $published}, on_conflict: {constraint: categories_organization_id_slug_key, update_columns: [slug, published]}) {
    returning {
      id
      slug
      published
    }
  }
}`;
function hasuraUpsertSection(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_UPSERT_SECTION,
    name: 'MyMutation',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
      published: params['published'],
      title: params['title'],
    },
  });
}

const HASURA_LIST_TAGS = `query MyQuery {
  tags(where: {published: {_eq: true}}) {
    slug
    tag_translations {
      locale_code
      title
    }
  }
}`;

function hasuraListTags(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_TAGS,
    name: 'MyQuery',
  });
}

const HASURA_LIST_SECTIONS = `query MyQuery {
  categories(where: {published: {_eq: true}}) {
    slug
    category_translations {
      title
      locale_code
    }
  }
}`;

function hasuraListSections(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_SECTIONS,
    name: 'MyQuery',
  });
}

const HASURA_LIST_ORG_LOCALES = `query MyQuery {
  organization_locales {
    locale {
      code
    }
  }
}`;
function hasuraListLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_LIST_ORG_LOCALES,
    name: 'MyQuery',
    variables: {
      locale_code: params['localeCode'],
      slug: params['slug'],
    },
  });
}

async function fetchGraphQL(params) {
  let url;
  let orgSlug;
  if (!params.hasOwnProperty('url')) {
    url = HASURA_API_URL;
  } else {
    url = params['url'];
  }
  if (!params.hasOwnProperty('orgSlug')) {
    orgSlug = ORG_SLUG;
  } else {
    orgSlug = params['orgSlug'];
  }
  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'TNC-Organization': orgSlug,
    },
    body: JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

module.exports = {
  hasuraListLocales,
  hasuraListSections,
  hasuraListTags,
  hasuraUpsertHomepageLayout,
  hasuraUpsertMetadata,
  hasuraUpsertSection,
  fetchGraphQL

}