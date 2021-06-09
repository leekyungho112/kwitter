import { dbService, storageService } from 'fbase';
import React, { useState } from 'react';
import styles from 'components/Kweet.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

const Kweet = ({ kweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false);
  const [newKweets, setNewKweets] = useState(kweetObj.text);

  const onSubmit = (event) => {
    event.preventDefault();
    dbService.doc(`kweets/${kweetObj.id}`).update({
      text: newKweets,
    });
    setEditing(false);
  };

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewKweets(value);
  };

  const onClickDelete = async () => {
    const ok = window.confirm('정말 삭제하기를 원하십니까?');
    console.log(ok);
    if (ok) {
      //delete
      await dbService.doc(`kweets/${kweetObj.id}`).delete();
      if (kweetObj.attachmentUrl !== '') {
        await storageService.refFromURL(kweetObj.attachmentUrl).delete();
      }
    }
  };
  return (
    <div className={styles.kweet}>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form
                onSubmit={onSubmit}
                className={[styles.container, styles.kweetEdit].join(' ')}
              >
                <input
                  type="text"
                  value={newKweets}
                  placeholder="Edit your kweet"
                  onChange={onChange}
                  required
                  autoFocus
                  className={styles.formInput}
                />
                <input
                  type="submit"
                  value="Update Kweet"
                  className={styles.formBtn}
                />
              </form>
              <span
                onClick={toggleEditing}
                className={[styles.formBtn, styles.cancelBtn].join(' ')}
              >
                Cancel
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{kweetObj.text}</h4>
          <h6>{kweetObj.createdAt}</h6>
          {kweetObj.attachmentUrl && (
            <img
              src={kweetObj.attachmentUrl}
              alt={kweetObj.attachmentUrl}
              className={styles.img}
            />
          )}
          {isOwner && (
            <div className={styles.kweet__actions}>
              <span onClick={onClickDelete}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Kweet;
