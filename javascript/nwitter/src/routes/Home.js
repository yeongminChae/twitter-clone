import { dbService, storageService } from "fBase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Nweet from "components/Nweet";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attatchment, setAttatchment] = useState("");
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
    let attatchmentUrl = "";
    if (attatchment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attatchment, "data_url");
      attatchmentUrl = await getDownloadURL(response.ref);
    }
    try {
      const nweetObj = {
        text: nweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attatchmentUrl,
      };
      console.log("Document written by ID", nweetObj.id);
      await addDoc(collection(dbService, "nweets"), nweetObj);
    } catch (error) {
      console.error("Error adding document", error);
    }
    setNweet("");
    setAttatchment("");
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
  const onClearAttatchment = () => setAttatchment("");
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          text="text"
          value={nweet}
          onChange={onChange}
          placeholder="what is on your mind"
          required
          maxLength={120}
        />
        <label>
          <svg
            className="h-12 w-12"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="hidden appearance-none"
          />
        </label>
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
