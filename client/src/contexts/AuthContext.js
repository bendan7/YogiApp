import React, { useContext, useEffect, useState } from "react";
import { auth, firestore } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password, userName) {
    return auth
      .createUserWithEmailAndPassword(email, password)
      .then((userCardi) => {
        const user = auth.currentUser;
        user.updateProfile({ displayName: userName });
      });
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateUserPassword(password) {
    return currentUser.updatePassword(password);
  }

  async function GetReq() {
    if (currentUser == null) {
      return;
    }

    var accessToken = null;
    await currentUser.getIdToken().then(function (token) {
      accessToken = token;
    });

    const req = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    };
    return req;
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        user.getIdTokenResult().then((tokenResult) => {
          if (tokenResult.claims.isAdmin) {
            user.isAdmin = true;
          }
          setCurrentUser(user);
          setLoading(false);
        });
      } else {
        setCurrentUser(user);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    logout,
    signup,
    resetPassword,
    updateUserPassword,
    GetReq,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
}
