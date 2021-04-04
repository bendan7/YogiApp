import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import { useAuth } from "./AuthContext";

const UserContext = React.createContext();

export function useMeetingsContext() {
  return useContext(UserContext);
}

export function MeetingProvider({ children }) {
  const { currentUser } = useAuth();

  //upcoming meetings list
  const [meetings, setMeetings] = useState([]);

  function ConnectMeetingsDB() {
    return firestore.collection("upcoming").onSnapshot((snapshot) => {
      // REALTIME DB - onChange
      const newMeetings = snapshot.docs.map((doc) => {
        const meetingObj = doc.data();
        meetingObj.id = doc.id;
        return meetingObj;
      });

      setMeetings(newMeetings);
    });
  }

  useEffect(() => {
    if (currentUser) {
      return ConnectMeetingsDB();
    }
  }, []);

  const value = {
    meetings,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
