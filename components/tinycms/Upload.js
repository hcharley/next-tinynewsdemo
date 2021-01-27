import React, { useEffect, useRef, useState } from 'react';
import S3 from 'react-aws-s3';

export default function Upload(props) {
  const fileInput = useRef();
  const [imageSrc, setImageSrc] = useState(props.bioImage);
  const [randomKey, setRandomKey] = useState(Math.random());

  useEffect(() => {
    if (props.bioImage) {
      setImageSrc(props.bioImage);
    }
  }, [props.bioImage]);

  const handleClick = (event) => {
    event.preventDefault();

    let file = fileInput.current.files[0];
    let newFilename = 'authors/' + props.slug; // ;

    const ReactS3Client = new S3(props.awsConfig);
    ReactS3Client.uploadFile(file, newFilename)
      .then((data) => {
        if (data.status === 204) {
          props.setBioImage(data.location);
          setImageSrc(data.location + '?' + Math.random());
          setRandomKey(Math.random());
          props.setNotificationMessage('Successfully uploaded the image');
          props.setNotificationType('success');
          props.setShowNotification(true);
        } else {
          console.log('failed uploading image:', data);
          props.setNotificationMessage(
            'An error occurred while uploading the image:',
            JSON.stringify(data)
          );
          props.setNotificationType('error');
          props.setShowNotification(true);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <article className="media">
        <figure className="media-left">
          <p
            className="image is-128x128"
            style={{ height: '128px', width: '128px' }}
          >
            <img src={imageSrc} key={randomKey} />
          </p>
        </figure>
        <div className="media-content">
          <div className="content">
            <form className="upload-steps" onSubmit={handleClick}>
              <div className="file">
                <label className="file-label">
                  <input className="file-input" type="file" ref={fileInput} />
                  <span className="file-cta">
                    <span className="file-icon">
                      <i className="fas fa-upload"></i>
                    </span>
                    <span className="file-label">Choose a file…</span>
                  </span>
                </label>
              </div>
              <div className="field">
                <p className="control">
                  <button type="submit">Upload</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </article>
    </>
  );
}