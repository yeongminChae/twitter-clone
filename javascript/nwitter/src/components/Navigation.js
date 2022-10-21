import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Navigation = ({ userObj }) => {
  return (
    <nav>
      <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
          <Link
            to="/"
            style={{
              marginRight: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
            <span style={{ marginTop: 10 }}>To Home</span>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
            <span style={{ marginTop: 10 }}>
              {userObj?.displayName?.length
                ? `${userObj.displayName}'s Profile`
                : `${userObj.email?.split(`@`)[0]}'s profile`}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default Navigation;
