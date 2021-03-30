import React from "react";
import Signup from "../pages/Signup";
import UserDashboard from "../pages/UserDashboard";
import Login from "../pages/Login";
import {} from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "../pages/ForgotPassword";
import UpdateProfile from "../pages/UpdateProfile";
import PrivateAdminRoute from "./PrivateAdminRoute";
import AdminDashboard from "../pages/AdminDashboard";

export default function App() {
  return (
    <div
      className="d-flex align-items-top justify-content-center w-100 p-3"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "800px" }}>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={UserDashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <PrivateAdminRoute path="/admin" component={AdminDashboard} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  );
}
