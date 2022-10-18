import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";
import Profile from "../routes/Profile";
import Navigation from "./Navigation";

interface IRouter {
  isLoggedIn: boolean;
}

const AppRouter = ({ isLoggedIn }: IRouter) => {
  return (
    <Router>
      {isLoggedIn && <Navigation />}
      <Switch>
        {isLoggedIn ? (
          <>
            {/* <> = fragment , we use this when we want to render many elements and they don't have parents element */}
            <Route exact path="/">
              <Home />{" "}
            </Route>
            <Route exact path="/profile">
              <Profile />{" "}
            </Route>
          </>
        ) : (
          <>
            <Route exact path="/">
              <Auth />{" "}
            </Route>
          </>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
