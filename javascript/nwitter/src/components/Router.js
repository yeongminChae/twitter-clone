import React, { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          <>
            {/* <> = fragment , we use this when we want to render many elements and they don't have parents element */}
            <Route exact path="/">
              <Home />{" "}
            </Route>
          </>
        ) : (
          <Route exact path="/">
            <Auth />{" "}
          </Route>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
