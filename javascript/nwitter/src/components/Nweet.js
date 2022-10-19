import React, { useState } from "react";
import { dbService, storageService } from "fBase";
import { doc, deleteDoc, updateDoc, getFirestore } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

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
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit your nweet"
                  value={newNweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update Nweet" />
              </form>
              <button onClick={toggleEditing}>Cancle</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text} </h4>
          {nweetObj.attatchmentUrl && (
            <img
              src={nweetObj.attatchmentUrl}
              width="50px"
              height="50px"
              alt="tweet pics"
            />
          )}
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete BTN</button>
              <button onClick={toggleEditing}>Edit BTN</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
