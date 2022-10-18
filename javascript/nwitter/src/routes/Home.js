import React, { useState } from "react";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const onSubmit = (event) => {
    event.prevetDefault();
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };
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
        <input type="submit" value="Tweet" />
      </form>
    </div>
  );
};
export default Home;
