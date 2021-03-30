import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (currentUser && currentUser.isAdmin) {
          return <Redirect to="/admin" />;
        } else if (currentUser) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    ></Route>
  );
}
