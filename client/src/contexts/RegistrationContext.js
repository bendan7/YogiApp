import React, { useContext, useEffect, useState } from "react";

const RegistrationContext = React.createContext();

export function useRegistration() {
  return useContext(RegistrationContext);
}

export function RegistrationProvider({ children }) {
  console.log("RegistrationProvider");
  const [WillParticipate, setWillParticipate] = useState();
  const [Participated, setParticipated] = useState();

  function login(email, password) {
    //return auth.signInWithEmailAndPassword(email, password);
  }

  useEffect(() => {}, []);

  const value = {
    WillParticipate,
    Participated,
    setParticipated,
    login,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}
