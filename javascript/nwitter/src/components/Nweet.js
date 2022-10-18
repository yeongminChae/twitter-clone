import React from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  return (
    <div>
      <h4>{nweetObj.text} </h4>
      {isOwner && (
        <>
          <button>Delete BTN</button>
          <button>Edit BTN</button>
        </>
      )}
    </div>
  );
};

export default Nweet;
