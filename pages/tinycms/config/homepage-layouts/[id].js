import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../../components/AdminLayout';
import {
  getHomepageLayout,
  listLayoutSchemaIds,
  updateHomepageLayout,
} from '../../../../lib/homepage';
import AdminNav from '../../../../components/nav/AdminNav';
import Notification from '../../../../components/tinycms/Notification';

export default function EditHomepageLayout({
  apiUrl,
  apiToken,
  homepageLayout,
}) {
  console.log('homepageLayout:', homepageLayout);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [homepageLayoutId, setHomepageLayoutId] = useState('');

  const [name, setName] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    if (homepageLayout) {
      setName(homepageLayout.name);
      setData(JSON.parse(homepageLayout.data));
      setHomepageLayoutId(homepageLayout.id);
    }
  }, []);
  const router = useRouter();

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/config');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await updateHomepageLayout(
      apiUrl,
      apiToken,
      homepageLayoutId,
      name,
      data
    );

    if (
      response.homepageLayoutSchemas.updateHomepageLayoutSchema.error !== null
    ) {
      setNotificationMessage(
        response.homepageLayoutSchemas.updateHomepageLayoutSchema.error
      );
      setNotificationType('error');
      setShowNotification(true);
    } else {
      setHomepageLayoutId(
        response.homepageLayoutSchemas.updateHomepageLayoutSchema.data.id
      );
      // display success message
      setNotificationMessage(
        'Successfully saved and published the homepage layout!'
      );
      setNotificationType('success');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}

      <div id="page">
        <h1 className="title">Edit Homepage Layout</h1>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">
              Name
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="data">
              Data
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={data}
                name="data"
                onChange={(ev) => setData(ev.target.value)}
              />
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <input
                className="button is-link"
                name="submit"
                type="submit"
                value="Submit"
              />
            </div>
            <div className="control">
              <button
                className="button is-link is-light"
                name="cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
export async function getStaticPaths() {
  const paths = await listLayoutSchemaIds();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.ADMIN_CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;
  let homepageLayout = await getHomepageLayout(params.id);
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      homepageLayout: homepageLayout,
    },
  };
}