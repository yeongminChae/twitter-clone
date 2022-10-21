import { v4 as uuidv4 } from "uuid";
import { authService, dbService, storageService } from "fBase";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import userImage from "images/user.png";

function Profile({ userObj, refreshUser }) {
  const history = useHistory();
  const [newPhotoURL, setNewPhotoURL] = useState("");
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [attatchment, setAttatchment] = useState("");
  const [editing, setEditing] = useState(false);
  const fileImageInput = useRef();
  let photoDownloadUrl = "";

  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const q1 = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapsho1 = await getDocs(q1);
    querySnapsho1.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
    const q2 = query(
      collection(dbService, "profile"),
      where("creatorId", "==", userObj.uid),
      orderBy("photoURL", "desc")
    );
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  const onChange = (event) => {
    if (event) {
      const {
        target: { value },
      } = event;
      setNewDisplayName(value);
      setNewPhotoURL(value);
    } else {
      event.preventDefault();
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    let attatchmentUrl = "";
    if (attatchment !== photoDownloadUrl) {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attatchment, "data_url");
      photoDownloadUrl = await getDownloadURL(response.ref);
    }
    try {
      const updateUser = {
        createdAt: Date.now(),
        creatorId: userObj.uid,
        photoURL: userObj.photoURL,
        attatchmentUrl,
      };
      await addDoc(collection(dbService, "profile"), updateUser);
      await updateProfile(authService.currentUser, {
        photoURL: photoDownloadUrl,
      });
      refreshUser();
    } catch (error) {
      console.error("Error adding document", error);
    }
    setNewPhotoURL(photoDownloadUrl);
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  useEffect(() => {
    getMyNweets();
  }, []);
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    if (reader && theFile !== undefined && theFile !== null) {
      reader.onloadend = (finishEvent) => {
        const {
          currentTarget: { result },
        } = finishEvent;
        setAttatchment(result);
        fileImageInput.current.src = result;
      };
      reader.readAsDataURL(theFile);
    }
  };
  const onClearAttatchment = () => setAttatchment("");
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  return (
    <div className="container">
      <div>
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
        {attatchment ? (
          <>
            {editing ? (
              <div className="mb-10 flex items-center justify-center ">
                <img
                  className="h-36 w-36 rounded-full shadow-xl"
                  ref={fileImageInput}
                  src={userObj?.photoURL ? userObj.photoURL : userImage}
                  alt={userObj?.email}
                ></img>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center ">
                <div className="mb-10 flex items-center justify-center ">
                  <img
                    src={attatchment}
                    className="h-36 w-36 rounded-full"
                    alt="pics"
                  />
                </div>
                <div
                  className="factoryForm__clear"
                  onClick={onClearAttatchment}
                >
                  <span className=" flex items-center justify-center ">
                    Remove
                  </span>
                  <FontAwesomeIcon
                    className="ml-[1.15rem] flex flex-col items-center justify-center "
                    icon={faTimes}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mb-10 flex items-center justify-center  ">
            <img
              alt="profile"
              src={userObj.photoURL}
              className="h-36 w-36 rounded-full shadow-xl"
            />
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          placeholder="Display Name"
          onChange={onChange}
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          onClick={toggleEditing}
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
}

export default Profile;
