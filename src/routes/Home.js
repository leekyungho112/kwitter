import Kweet from 'components/Kweet';
import KweetFactory from 'components/KweetFactory';
import { dbService } from 'fbase';
import React, { useEffect, useState } from 'react';

const Home = ({ userObj }) => {
  const [kweets, setKweets] = useState([]);

  useEffect(() => {
    const getData = dbService
      .collection('kweets')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const kweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setKweets(kweetArray);
      });
    return () => getData();
  }, []);

  return (
    <div className="container">
      <KweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {kweets.map((kt) => (
          <Kweet
            key={kt.id}
            kweetObj={kt}
            isOwner={kt.createrId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
