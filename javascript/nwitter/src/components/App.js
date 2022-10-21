import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { authService } from "fBase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserObj({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          uid: user.uid,
          updateProfile: (args) =>
            updateProfile(
              user,
              { displayName: user.displayName },
              { photoURL: user.photoURL }
            ),
        });
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
      updateProfile: (args) =>
        updateProfile(
          user,
          { displayName: user.displayName },
          { photoURL: user.photoURL }
        ),
    });
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      {/* <footer>&copy; {new Date().getFullYear()} Nwitter </footer> */}
    </>
  );
}

export default App;
