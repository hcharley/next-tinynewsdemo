import React, { useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import AdminNav from '../../../components/nav/AdminNav';
import AdminHeader from '../../../components/tinycms/AdminHeader';
import Notification from '../../../components/tinycms/Notification';
import Upload from '../../../components/tinycms/Upload';
import { hasuraListLocales } from '../../../lib/articles.js';
import { hasuraCreateAuthor } from '../../../lib/authors';
import { validateAuthorName, slugify } from '../../../lib/utils.js';

export default function AddAuthor({
  apiUrl,
  apiToken,
  currentLocale,
  locales,
  awsConfig,
}) {
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [twitter, setTwitter] = useState('');
  const [slug, setSlug] = useState('');
  const [staff, setStaff] = useState('no');
  const [bio, setBio] = useState('');
  const [bioImage, setBioImage] = useState('');
  const [displayUpload, setDisplayUpload] = useState(false);

  const router = useRouter();

  // removes leading @ from twitter handle before storing
  function updateTwitter(val) {
    let cleanedUpVal = val.replace(/@/, '');
    setTwitter(cleanedUpVal);
  }

  // slugifies the name and stores slug plus name values
  function updateName(val) {
    setName(val);
    let slugifiedVal = slugify(val);
    setSlug(slugifiedVal);

    setDisplayUpload(true);
  }

  const handleChange = (ev) => setStaff(ev.target.value);

  async function handleSubmit(ev) {
    ev.preventDefault();

    let nameIsValid = validateAuthorName(name);
    if (!nameIsValid) {
      setNotificationMessage(
        'Please use a real name of an actual person - editorial guidelines prohibit fake bylines: ' +
          name
      );
      setShowNotification(true);
      setNotificationType('error');
      setName('');
      setSlug('');
      setDisplayUpload(false);
      return false;
    }
    let published = true;
    let params = {
      url: apiUrl,
      orgSlug: apiToken,
      localeCode: currentLocale,
      bio: bio,
      title: title,
      name: name,
      published: published,
      slug: slug,
      staff: staff,
      twitter: twitter,
      photoUrl: bioImage,
    };
    const { errors, data } = await hasuraCreateAuthor(params);

    if (data && data.insert_authors_one) {
      setNotificationMessage('Successfully saved and published the author!');
      setNotificationType('success');
      setShowNotification(true);
      router.push('/tinycms/authors?action=create');
    } else if (errors) {
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    }
  }

  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} showConfigOptions={true} />

      {showNotification && (
        <Notification
          message={notificationMessage}
          setShowNotification={setShowNotification}
          notificationType={notificationType}
        />
      )}
      <div id="page">
        <AdminHeader
          locales={locales}
          currentLocale={currentLocale}
          title="Add an Author"
        />

        {displayUpload && (
          <Upload
            awsConfig={awsConfig}
            slug={slug}
            bioImage={bioImage}
            setBioImage={setBioImage}
            setNotificationMessage={setNotificationMessage}
            setNotificationType={setNotificationType}
            setShowNotification={setShowNotification}
          />
        )}

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
                onChange={(ev) => updateName(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="title">
              Title
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                name="title"
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="twitter">
              Twitter
            </label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="text"
                value={twitter}
                name="twitter"
                onChange={(ev) => updateTwitter(ev.target.value)}
              />
              <span className="icon is-small is-left">@</span>
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="bio">
              Bio
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bio}
                name="Twitter"
                onChange={(ev) => setBio(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="yes"
                  checked={staff === 'yes'}
                  onChange={handleChange}
                />{' '}
                Staff
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="no"
                  checked={staff === 'no'}
                  onChange={handleChange}
                />{' '}
                Not Staff
              </label>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <input type="submit" className="button is-link" value="Submit" />
            </div>
            <div className="control">
              <button className="button is-link is-light">Cancel</button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;
  const { errors, data } = await hasuraListLocales({
    url: apiUrl,
    orgSlug: apiToken,
  });

  let locales;

  if (errors || !data) {
    return {
      notFound: true,
    };
  } else {
    locales = data.organization_locales;
  }

  const awsConfig = {
    bucketName: process.env.TNC_AWS_BUCKET_NAME,
    dirName: process.env.TNC_AWS_DIR_NAME,
    region: process.env.TNC_AWS_REGION,
    accessKeyId: process.env.TNC_AWS_ACCESS_ID,
    secretAccessKey: process.env.TNC_AWS_ACCESS_KEY,
  };

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: context.locale,
      locales: locales,
      awsConfig: awsConfig,
    },
  };
}
