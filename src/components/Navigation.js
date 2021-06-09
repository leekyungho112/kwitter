import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import styles from 'components/Navigation.module.css';
const Navigation = ({ userObj }) => {
  return (
    <nav>
      <ul className={styles.nav}>
        <li>
          <Link to="/" className={styles.icon}>
            <FontAwesomeIcon icon={faTwitter} color={'#04AAFF'} size="2x" />
          </Link>
        </li>
        <li>
          <Link to="/profile" className={styles.link}>
            <img
              className={styles.avatar}
              src={userObj.photoURL}
              alt={userObj.photoURL}
            />{' '}
            {userObj.displayName
              ? `${userObj.displayName}의 Profile`
              : 'Profile'}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
