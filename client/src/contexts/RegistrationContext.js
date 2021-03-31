import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const RegistrationContext = React.createContext();

export function useRegistration() {
  return useContext(RegistrationContext);
}

export function RegistrationProvider({ children }) {
  const { currentUser, GetAuthHeader } = useAuth();

  //upcoming meetings list
  const [meetings, setMeetings] = useState([]);

  // registered upcoming meetings ids list
  const [registered, setRegistered] = useState([]);

  // user history is list of meeting and tickt purchases
  // the sum of left entries is calc by the user history AllTickts-AllMeetings
  const [userHistory, setUserHistory] = useState([]);
  const [userEntries, setUserEntries] = useState(0);

  function GetMeetings() {
    var upcomingRef = db.ref("upcoming/");

    upcomingRef.on("value", (snapshot) => {
      // REALTIME DB - onChange
      const newMeetings = Object.values(snapshot.val());
      setMeetings(newMeetings);

      const RegisteredMeeting = FindRegisteredMeetings(newMeetings);
      setRegistered(RegisteredMeeting);
    });
  }

  function FindRegisteredMeetings(meetingList) {
    const RegList = [];

    meetingList.forEach((meeting) => {
      const participates = Object.values(meeting.participates).map(
        (par) => par.uid
      );

      if (participates.includes(currentUser.uid)) {
        RegList.push(meeting.id);
      }
    });

    return RegList;
  }

  async function GetUserInfo() {
    var headers = await GetAuthHeader();

    fetch("/userhistory", headers).then((res) => {
      res.json().then((data) => {
        data.meetings.forEach((meeting) => {
          meeting.type = "meeting";
          meeting.date = new Date(meeting.date._seconds * 1000);
        });

        let totalPurchasedEntries = 0;
        data.tickts.forEach((tickt) => {
          tickt.type = "tickt";
          totalPurchasedEntries += tickt.num_of_entries;
          tickt.date = new Date(tickt.date._seconds * 1000);
        });

        const validEntries = totalPurchasedEntries - data.meetings.length;
        setUserEntries(validEntries);

        const history = data.meetings.concat(data.tickts);
        history.sort((a, b) => b.date - a.date);

        setUserHistory(history);
      });
    });
  }

  useEffect(() => {
    if (currentUser) {
      GetUserInfo();
      GetMeetings();
    }
  }, [currentUser]);

  const value = {
    meetings,
    registered,
    userHistory,
    userEntries,
  };

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}
