import { authService, storageService } from 'fbase';
import React, { useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styles from 'routes/Profile.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
const Profile = ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [avatar, setAvatar] = useState(userObj.photoURL);
  const [saving, setSaving] = useState(false);
  const avatarValue = useRef();

  const onLogOutClick = () => {
    authService.signOut();
    history.push('/');
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;

    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (!saving) {
      setSaving(true);
      if (userObj.displayName !== newDisplayName) {
        await userObj.updateProfile({
          displayName: newDisplayName,
        });

        refreshUser();
      }
      let avatarUrl = '';
      //profile photo update
      if (userObj.photoURL !== avatar) {
        const avatarRef = storageService
          .ref()
          .child(`${userObj.uid}/${uuidv4()}`);
        const response = await avatarRef.putString(avatar, 'data_url');
        avatarUrl = await response.ref.getDownloadURL();
        await userObj.updateProfile({
          photoURL: avatarUrl,
        });
        await storageService.refFromURL(userObj.photoURL).delete();
        refreshUser();
      }
    }
    setSaving(false);
    setAvatar('');
    setNewDisplayName('');
    avatarValue.current.value = '';
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
      setAvatar(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearPhotoClick = () => {
    setAvatar('');
    avatarValue.current.value = '';
  };

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.profileForm}>
        <input
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onChange={onChange}
          autoFocus
          className={styles.formInput}
        />
        <label htmlFor="attach-file" className={styles.factoryInput__label}>
          <span>Add photos</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={avatarValue}
          style={{ opacity: 0 }}
        />
        {avatar && (
          <div className={styles.factoryForm__attachment}>
            <img
              className={styles.img}
              src={avatar}
              alt={avatar}
              style={{ backgroundImage: avatar }}
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
        <input
          type="submit"
          value={saving ? 'save...' : 'update Profile'}
          className={styles.formBtn}
        />
      </form>
      <span
        className={[styles.formBtn, styles.cancelBtn, styles.logOut].join(' ')}
        onClick={onLogOutClick}
      >
        Log Out
      </span>
    </div>
  );
};

export default Profile;
