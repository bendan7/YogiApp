import React from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateAdminRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (currentUser && currentUser.isAdmin) {
          return <Component {...props} />;
        } else if (currentUser) {
          return <Redirect to="/" />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    ></Route>
  );
}
