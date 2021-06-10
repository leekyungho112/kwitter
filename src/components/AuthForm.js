import { authService } from 'fbase';
import React, { useState } from 'react';
import styles from 'components/AuthForm.module.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  const onChange = (e) => {
    const {
      target: { value, name },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let data;

      if (newAccount) {
        // create account
        data = await authService
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            user.updateProfile({
              displayName: user.email,
              photoURL:
                'https://w7.pngwing.com/pngs/858/581/png-transparent-profile-icon-user-computer-icons-system-chinese-wind-title-column-miscellaneous-service-logo.png',
            });
          });
      } else {
        // log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }

      console.log(data);
      window.location.replace('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className={styles.container}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
          className={styles.authInput}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
          className={styles.authInput}
        />
        <input
          type="submit"
          className={[styles.authInput, styles.authSubmit].join(' ')}
          value={newAccount ? 'Create Account' : 'Log In'}
        />
        {error && <span className={styles.authError}>{error}</span>}
      </form>
      <span onClick={toggleAccount} className={styles.authSwitch}>
        {newAccount ? '계정이 존재 하나요?' : '새로운 계정을 만드세요'}
      </span>
    </>
  );
};

export default AuthForm;
