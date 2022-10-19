import { dbService, storageService } from "fBase";
import {
  // addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString } from "firebase/storage";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attatchment, setAttatchment] = useState();
  //   const getNweets = async () => {
  //     const dbNweets = await getDocs(collection(dbService, "nweets"));
  //     dbNweets.forEach((document) => {
  //       const nweetObj = {
  //         ...document.data(),
  //         id: document.id,
  //       };
  //       setNweets((prev) => [document.data(), ...prev]);
  //     });
  //   };
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);
  const onSubmit = async (event) => {
    const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    const response = await uploadString(fileRef, attatchment, "data_url");
    console.log(response);
    // try {
    //   const docRef = await addDoc(collection(dbService, "nweets"), {
    //     text: nweet,
    //     createdAt: Date.now(),
    //     creatorId: userObj.uid,
    //   });
    //   console.log("Document written by ID", docRef.id);
    // } catch (error) {
    //   console.error("Error adding document", error);
    // }
    // setNweet("");
  };
  const onChange = ({ target: { value } }) => {
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishEvent) => {
      const {
        currentTarget: { result },
      } = finishEvent;
      setAttatchment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearAttatchment = () => setAttatchment(null);
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          text="text"
          value={nweet}
          onChange={onChange}
          placeholder="what is on your mind"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Tweet" className="cursor-pointer" />
        {attatchment && (
          <div>
            <img src={attatchment} width="50px" height="50px" alt="pics" />
            <button onClick={onClearAttatchment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
