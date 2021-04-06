import React, { useContext, useEffect, useState } from "react";
import { firestore } from "../firebase";
import { useAuth } from "./AuthContext";

const UserContext = React.createContext();

export function useMeetingsContext() {
  return useContext(UserContext);
}

export function MeetingProvider({ children }) {
  const { currentUser, GetReq } = useAuth();
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  //upcoming meetings list
  const [meetings, setMeetings] = useState();

  function ConnectMeetingsDB() {
    return firestore
      .collection("upcoming")
      .orderBy("datetime")
      .onSnapshot((snapshot) => {
        // REALTIME DB - onChange

        const newMeetings = snapshot.docs.map((doc) => {
          const meetingObj = doc.data();

          meetingObj.id = doc.id;

          //timestamp to date
          const date = new Date(meetingObj.datetime.seconds * 1000);

          //Add extra date and time strings for UI
          meetingObj.dateObj = date;
          meetingObj.date = `${date.getDate()}/${date.getMonth() + 1}`;
          meetingObj.dayName = days[date.getDay()];
          meetingObj.time = `${date.getHours()}:${
            (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
          }`;

          return meetingObj;
        });
        setMeetings(newMeetings);
      });
  }

  async function NewMeeting(meeting) {
    const requestOptions = await GetReq();
    requestOptions.method = "post";
    requestOptions.body = JSON.stringify(meeting);

    return fetch(
      `http://localhost:5001/nof-app-dev/europe-west3/app/meetings/`,
      requestOptions
    );
  }

  function DeleteMeeting(meeting) {
    return firestore.collection("upcoming").doc(meeting.id).delete();
  }

  useEffect(() => {
    if (currentUser) {
      ConnectMeetingsDB();
    }
  }, [currentUser]);

  const value = {
    meetings,
    NewMeeting,
    DeleteMeeting,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
