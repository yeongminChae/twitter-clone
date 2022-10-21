import React, { useState } from "react";
import { dbService, storageService } from "fBase";
import { doc, deleteDoc, updateDoc, getFirestore } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newNweet, setNweNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are You Sure to Delete this ? ");
    if (ok) {
      try {
        await deleteDoc(doc(getFirestore(), `nweets/${nweetObj.id}`));
        if (nweetObj.attatchmentUrl !== "") {
          await deleteObject(ref(storageService, nweetObj.attatchmentUrl));
        }
      } catch (error) {
        window.alert("fail to delete");
      }
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await updateDoc(NweetTextRef, { text: newNweet });
    setEditing(false);
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweNweet(value);
  };
  return (
    <div className="flex items-start justify-center">
      <div className="mt-[0.625rem] ">
        <img
          alt="profile"
          className="h-9 w-9 rounded-full object-fill shadow-xl "
          src={nweetObj.photoURL}
        />
      </div>

      <div className="nweet">
        {editing ? (
          <>
            {isOwner && (
              <>
                <form onSubmit={onSubmit} className="nweetEdit container">
                  <input
                    type="text"
                    placeholder="Edit your nweet"
                    value={newNweet}
                    required
                    autoFocus
                    className="formInput"
                    onChange={onChange}
                  />
                  <input
                    type="submit"
                    value="Update Nweet"
                    className="formBtn"
                  />
                </form>
                <span onClick={toggleEditing} className="formBtn cancelBtn">
                  Cancle
                </span>
              </>
            )}
          </>
        ) : (
          <>
            <h4>{nweetObj.text} </h4>
            {nweetObj.attatchmentUrl && (
              <img src={nweetObj.attatchmentUrl} alt="tweet pics" />
            )}
            {isOwner && (
              <>
                <div className="nweet__actions">
                  <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon={faTrash} />
                  </span>
                  <span onClick={toggleEditing}>
                    <FontAwesomeIcon icon={faPencilAlt} />
                  </span>
                </div>
              </>
            )}
          </>
        )}
        {/* <img alt="profile" className="h-4 w-4 " src={userObj.photoURL} /> */}
      </div>
    </div>
  );
};

export default Nweet;
