import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
  // if (userObj.displayName === null) {
  //   const name = userObj.email.split(`@`)[0];
  //   userObj.displayName = name;

  //
  // }
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">
            {userObj?.displayName?.length
              ? `${userObj.displayName}'s Profile`
              : `${userObj.email?.split(`@`)[0]}'s profile`}
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
