import React, { useState } from "react";
import { dbService } from "fBase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";

const Nweet = ({ nweetObj, isOwner }) => {
  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newNweet, setNweNweet] = useState(nweetObj.text);
  const onDeleteClick = async () => {
    const ok = window.confirm("Are You Sure to Delete this ? ");
    if (ok) {
      await deleteDoc(NweetTextRef);
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
      ) : (
        <>
          <h4>{nweetObj.text} </h4>
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
