import { authService, dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Profile({ userObj, refreshUser }) {
  const history = useHistory();
  const [attatchment, setAttatchment] = useState("");
  const [newUpdatePic, setNewUpdatePic] = useState(userObj.photoURL);
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
    setNewUpdatePic(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
    if (userObj.photoURL !== newUpdatePic) {
      await updateProfile(authService.currentUser, {
        photoURL: newUpdatePic,
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
    reader.onloadend = (finishEvent) => {
      const {
        currentTarget: { result },
      } = finishEvent;
      setAttatchment(result);
    };
    reader.readAsDataURL(theFile);
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
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
          <div className="flex h-32 w-full items-center justify-center">
            <img
              src={attatchment}
              style={{
                background: attatchment,
              }}
              alt="pics"
              className="mb-10 flex h-28 w-28 justify-center rounded-full object-scale-down	"
            />
          </div>
        ) : (
          <div className="flex h-32 w-full items-center justify-center">
            <img
              alt="profile"
              src={userObj?.photoURL}
              className="mb-10 flex h-28 w-28 justify-center rounded-full"
            />
          </div>
        )}
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
