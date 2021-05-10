const { replace } = require("formik");
const fetch = require("node-fetch");

const INSERT_ORGANIZATION_MUTATION = `mutation MyMutation($slug: String = "", $name: String = "") {
  insert_organizations_one(object: {name: $name, slug: $slug}) {
    id
    name
    slug
  }
}`;

function hasuraInsertOrganization(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: INSERT_ORGANIZATION_MUTATION,
    name: 'MyMutation',
    variables: {
      name: params['name'],
      slug: params['slug'],
    },
  });
}

const INSERT_ORG_LOCALES_MUTATION = `mutation MyMutation($objects: [organization_locales_insert_input!]!)
 {
  insert_organization_locales(
    objects: $objects
  ) {
    affected_rows
  }
}`

function hasuraInsertOrgLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: INSERT_ORG_LOCALES_MUTATION,
    name: 'MyMutation',
    variables: {"objects": params['orgLocales']}
  });
}

const HASURA_UPSERT_METADATA = `mutation MyMutation($published: Boolean, $data: jsonb, $locale_code: String, $organization_id: Int!) {
  insert_site_metadatas(objects: {organization_id: $organization_id, published: $published, site_metadata_translations: {data: {data: $data, locale_code: $locale_code}, on_conflict: {constraint: site_metadata_translations_locale_code_site_metadata_id_key, update_columns: data}}}, on_conflict: {constraint: site_metadatas_organization_id_key, update_columns: published}) {
    returning {
      id
      published
    }
  }
}`;

function hasuraUpsertMetadata(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_UPSERT_METADATA,
    name: 'MyMutation',
    variables: {
      organization_id: params['organization_id'],
      data: params['data'],
      published: params['published'],
      locale_code: params['locale_code']
    },
  });
}

const HASURA_REMOVE_ORGANIZATION = `mutation MyMutation($slug: String!) {
    delete_organization_locales(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_category_translations(where: {category: {organization: {slug: {_eq: $slug}}}}) {
      affected_rows
    }
    delete_categories(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_site_metadata_translations(where: {site_metadata: {organization: {slug: {_eq: $slug}}}}) {
      affected_rows
    }
    delete_site_metadatas(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_homepage_layout_schemas(where: {organization: {slug: {_eq: $slug}}}) {
      affected_rows
    }
    delete_organizations(where: {slug: {_eq: $slug}}) {
      affected_rows
    }  
}`;

function hasuraRemoveOrganization(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_REMOVE_ORGANIZATION,
    name: 'MyMutation',
    variables: {
      slug: params['slug'],
    },
  });
}

const HASURA_UPSERT_LAYOUT = `mutation MyMutation($organization_id: Int!, $name: String!, $data: jsonb!) {
  insert_homepage_layout_schemas(objects: {name: $name, data: $data, organization_id: $organization_id}, on_conflict: {constraint: homepage_layout_schemas_name_organization_id_key, update_columns: [name, data]}) {
    returning {
      id
      name
    }
  }
}`;

function hasuraUpsertHomepageLayout(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_UPSERT_LAYOUT,
    name: 'MyMutation',
    variables: {
      organization_id: params['organization_id'],
      name: params['name'],
      data: params['data'],
    },
  });
}

const HASURA_INSERT_SECTIONS = `mutation MyMutation($objects: [categories_insert_input!]!) {
  insert_categories(objects: $objects, on_conflict: {constraint: categories_organization_id_slug_key, update_columns: [slug, published]}) {
    returning {
      id
      slug
      published
    }
  }
}`;

function hasuraInsertSections(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_INSERT_SECTIONS,
    name: 'MyMutation',
    variables: {
      objects: params['objects']
    }
  });
}

function hasuraUpsertSection(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_UPSERT_SECTION,
    name: 'MyMutation',
    variables: {
      organization_id: params['organization_id'],
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

const HASURA_LIST_ALL_LOCALES = `query MyQuery {
  locales {
    id
    code
    name
  }
}`;

function hasuraListAllLocales(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_ALL_LOCALES,
    name: 'MyQuery'
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

const HASURA_LIST_ORGANIZATIONS = `query MyQuery {
  organizations {
    created_at
    id
    name
    slug
    organization_locales {
      locale {
        code
      }
    }
  }
}`;

function hasuraListOrganizations(params) {
  return fetchGraphQL({
    url: params['url'],
    adminSecret: params['adminSecret'],
    query: HASURA_LIST_ORGANIZATIONS,
    name: 'MyQuery',
  });
}

const HASURA_INSERT_PAGE_VIEW_DATA = `mutation MyMutation($count: Int!, $date: date!, $path: String!) {
  insert_ga_page_views_one(object: {count: $count, date: $date, path: $path}) {
    updated_at
    id
    path
    created_at
    count
    date
    organization_id
  }
}`;

function hasuraInsertPageView(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_PAGE_VIEW_DATA,
    name: 'MyMutation',
    variables: {
      count: params['count'],
      date: params['date'],
      path: params['path'],
    },
  })
}

const HASURA_INSERT_REFERRAL_SESSION_DATA = `mutation MyMutation($count: Int!, $date: date!, $source: String!) {
  insert_ga_referral_sessions_one(object: {source: $source, count: $count, date: $date}) {
    updated_at
    id
    created_at
    source
    count
    date
    organization_id
  }
}`;

function hasuraInsertReferralSession(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_REFERRAL_SESSION_DATA,
    name: 'MyMutation',
    variables: {
      count: params['count'],
      source: params['source'],
      date: params['date'],
    },
  })
}

const HASURA_INSERT_GEO_SESSION_DATA = `mutation MyMutation($count: Int!, $date: date!, $region: String!) {
  insert_ga_geo_sessions_one(object: {region: $region, count: $count, date: $date}) {
    updated_at
    id
    created_at
    region
    count
    date
    organization_id
  }
}`;

function hasuraInsertGeoSession(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_GEO_SESSION_DATA,
    name: 'MyMutation',
    variables: {
      count: params['count'],
      region: params['region'],
      date: params['date'],
    },
  })
}

const HASURA_INSERT_SESSION_DATA = `mutation MyMutation($count: Int!, $date: date!) {
  insert_ga_sessions_one(object: {count: $count, date: $date}) {
    updated_at
    id
    created_at
    count
    date
    organization_id
  }
}`;

function hasuraInsertSession(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_SESSION_DATA,
    name: 'MyMutation',
    variables: {
      count: params['count'],
      date: params['date'],
    },
  })
}

const HASURA_INSERT_SESSION_DURATION_DATA = `mutation MyMutation($seconds: float8!, $date: date!) {
  insert_ga_session_duration_one(object: {seconds: $seconds, date: $date}) {
    updated_at
    id
    created_at
    seconds
    date
    organization_id
  }
}`;

function hasuraInsertSessionDuration(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_SESSION_DURATION_DATA,
    name: 'MyMutation',
    variables: {
      seconds: params['seconds'],
      date: params['date'],
    },
  })
}

const HASURA_INSERT_READING_FREQUENCY_DATA = `mutation MyMutation($category: String!, $count: Int!, $date: date!) {
  insert_ga_reading_frequency_one(object: {count: $count, category: $category, date: $date}) {
    id
    updated_at
    organization_id
    date
    created_at
    category
    count
  }
}`;

function hasuraInsertReadingFrequency(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_READING_FREQUENCY_DATA,
    name: 'MyMutation',
    variables: {
      category: params['category'],
      count: params['count'],
      date: params['date'],
    },
  })
}

const HASURA_INSERT_READING_DEPTH_DATA = `mutation MyMutation($date: date!, $path: String!, $read_100: float8!, $read_25: float8!, $read_50: float8!, $read_75: float8!) {
  insert_ga_reading_depth_one(object: {path: $path, date: $date, read_25: $read_25, read_50: $read_50, read_75: $read_75, read_100: $read_100}) {
    id
    date
    organization_id
    path
    read_100
    read_25
    read_50
    read_75
    updated_at
    created_at
  }
}`;

const HASURA_GET_READING_DEPTH_DATA = `query MyQuery($path: String_comparison_exp, $date: date_comparison_exp) {
  ga_reading_depth(where: {path: $path, date: $date}) {
    date
    id
    organization_id
    path
    read_100
    read_25
    read_50
    read_75
  }
}`;

function hasuraGetReadingDepth(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_GET_READING_DEPTH_DATA,
    name: 'MyQuery',
    variables: {
      path: params['path'],
      date: params['date'],
    },
  })
}

function hasuraInsertReadingDepth(params) {
  return fetchGraphQL({
    url: params['url'],
    orgSlug: params['orgSlug'],
    query: HASURA_INSERT_READING_DEPTH_DATA,
    name: 'MyMutation',
    variables: {
      date: params['date'],
      path: params['path'],
      read_25: params['read_25'],
      read_50: params['read_50'],
      read_75: params['read_75'],
      read_100: params['read_100'],
    },
  })
}

async function fetchGraphQL(params) {
  let url;
  let orgSlug;
  if (!params.hasOwnProperty('url')) {
    url = HASURA_API_URL;
  } else {
    url = params['url'];
  }

  let requestHeaders;

  if (params.hasOwnProperty('orgSlug')) {
    orgSlug = params['orgSlug'];
    requestHeaders = {
      'TNC-Organization': orgSlug
    };
  } else if (params.hasOwnProperty('adminSecret')) {
    requestHeaders = {
      "x-hasura-admin-secret": params['adminSecret']
    };
  }

  let operationQuery = params['query'];
  let operationName = params['name'];
  let variables = params['variables'];

  const result = await fetch(url, {
    method: 'POST',
    headers: requestHeaders,
    body: JSON.stringify({
      query: operationQuery,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

function sanitizePath(path) {
  if (/\?/.test(path)) {
    path = path.split('?')[0];
  }
  if (/\/en-US\//.test(path)) {
    path = path.replace('/en-US', '');
  }
  return path;
}

module.exports = {
  hasuraInsertOrganization,
  hasuraInsertOrgLocales,
  hasuraInsertPageView,
  hasuraInsertSession,
  hasuraInsertSessionDuration,
  hasuraInsertGeoSession,
  hasuraInsertReferralSession,
  hasuraGetReadingDepth,
  hasuraInsertReadingDepth,
  hasuraInsertReadingFrequency,
  hasuraListAllLocales,
  hasuraListLocales,
  hasuraListOrganizations,
  hasuraListSections,
  hasuraListTags,
  hasuraUpsertHomepageLayout,
  hasuraUpsertMetadata,
  hasuraInsertSections,
  hasuraUpsertSection,
  hasuraRemoveOrganization,
  fetchGraphQL,
  sanitizePath
}