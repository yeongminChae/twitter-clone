import { authService } from "fBase";
import React from "react";
import { useHistory } from "react-router-dom";

function Profile() {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  return (
    <div>
      Profile
      <button onClick={onLogOutClick}>Log Out</button>
    </div>
  );
}
export default Profile;
