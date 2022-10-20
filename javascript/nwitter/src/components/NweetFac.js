import { v4 as uuidv4 } from "uuid";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { dbService, storageService } from "fBase";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFac = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attatchment, setAttatchment] = useState("");
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
  console.log(userObj);
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          text="text"
          value={nweet}
          onChange={onChange}
          placeholder="what is on your mind"
          required
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add Photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attatchment && (
        <div className="factoryForm__attachment">
          <img
            src={attatchment}
            style={{
              background: attatchment,
            }}
            alt="pics"
          />
          <div className="factoryForm__clear" onClick={onClearAttatchment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFac;
