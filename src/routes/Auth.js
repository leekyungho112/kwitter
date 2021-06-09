import AuthForm from 'components/AuthForm';
import { authService, firebaseInstance } from 'fbase';
import React from 'react';
import styles from 'components/Auth.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faGoogle,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === 'google') {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === 'github') {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    await authService.signInWithPopup(provider);
  };

  return (
    <div className={styles.authContainer}>
      <FontAwesomeIcon
        icon={faTwitter}
        color={'#04AAFF'}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <div className={styles.authBtns}>
        <button
          name="google"
          onClick={onSocialClick}
          className={styles.authBtn}
        >
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button
          name="github"
          onClick={onSocialClick}
          className={styles.authBtn}
        >
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  );
};

export default Auth;
