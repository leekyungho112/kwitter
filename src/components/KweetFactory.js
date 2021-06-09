import { dbService, storageService } from 'fbase';
import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from 'components/KweetFactory.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
const KweetFactory = ({ userObj }) => {
  const [kweet, setKweet] = useState('');
  const [attachment, setAttachment] = useState('');
  const fileValue = useRef();
  const onSubmit = async (e) => {
    if (kweet === '') {
      return;
    }
    e.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const kweetObj = {
      text: kweet,
      createdAt: Date.now(),
      createrId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection('kweets').add(kweetObj);
    setKweet('');
    setAttachment('');
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setKweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };

    reader.readAsDataURL(theFile);
  };
  const onClearPhotoClick = () => {
    setAttachment('');
    fileValue.current.value = '';
  };

  return (
    <form onSubmit={onSubmit} className={styles.factoryForm}>
      <div className={styles.factoryInput__container}>
        <input
          type="text"
          value={kweet}
          className={styles.factoryInput__input}
          placeholder="what's on your mind?"
          maxLength={120}
          onChange={onChange}
        />
        <input
          type="submit"
          value="&rarr;"
          className={styles.factoryInput__arrow}
        />
      </div>
      <label htmlFor="attach-file" className={styles.factoryInput__label}>
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        ref={fileValue}
        style={{
          opacity: 0,
        }}
      />

      {attachment && (
        <div className={styles.factoryForm__attachment}>
          <img
            className={styles.img}
            src={attachment}
            alt={attachment}
            style={{ backgroundImage: attachment }}
          />
          <div
            className={styles.factoryForm__clear}
            onClick={onClearPhotoClick}
          >
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default KweetFactory;
