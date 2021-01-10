import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listAllSections } from '../../../lib/articles.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import { localiseText } from '../../../lib/utils';
import { listAllLocales } from '../../../lib/articles.js';
import { cachedContents } from '../../../lib/cached';

export default function Sections({ sections, currentLocale, locales }) {
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setMessage('Successfully updated section.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created section.');
    }
  }, []);

  const listItems = sections.map((section) => {
    let title = localiseText(currentLocale, section.title);
    return (
      <li key={section.id}>
        <Link
          key={`${section.id}-link`}
          href={`/tinycms/sections/${section.id}`}
        >
          <a>{title}</a>
        </Link>{' '}
        ({section.slug})
      </li>
    );
  });

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />
      <div id="page">
        <AdminHeader
          locales={locales}
          currentLocale={currentLocale}
          title="Sections"
        />

        {message && <div className="success">{message}</div>}
        <ul>{listItems}</ul>

        <section className="section">
          <Link href="/tinycms/sections/add">
            <button className="button">Add Section</button>
          </Link>
        </section>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const localeMappings = await cachedContents('locales', listAllLocales);

  const currentLocale = localeMappings.find(
    (localeMap) => localeMap.code === context.locale
  );

  let sections = await listAllSections();
  return {
    props: {
      sections: sections,
      currentLocale: currentLocale,
      locales: localeMappings,
    },
  };
}