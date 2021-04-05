import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useMeetingsContext } from "./MeetingContext";

const UserContext = React.createContext();

export function useUserContext() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const { currentUser, GetReq } = useAuth();

  //upcoming meetings list
  const { meetings } = useMeetingsContext();

  // registered upcoming meetings ids list
  const [registered, setRegistered] = useState([]);

  // user history is list of meeting and tickt purchases
  // the sum of left entries is calc by the user history AllTickts-AllMeetings
  const [userHistory, setUserHistory] = useState([]);
  const [userEntries, setUserEntries] = useState(0);

  function FindUserRegisteredMeetings(meetingList) {
    const RegList = [];

    meetingList?.forEach((meeting) => {
      meeting.participates?.forEach((par) => {
        if (par.uid === currentUser.uid) {
          RegList.push(meeting.id);
        }
      });
    });

    return RegList;
  }

  async function GetUserInfo() {
    const req = await GetReq();
    fetch("/userhistory", req).then((res) => {
      res
        .json()
        .then((data) => {
          data.meetings.forEach((meeting) => {
            meeting.type = "meeting";
            meeting.date = new Date(meeting.date._seconds * 1000);
          });

          let totalPurchasedEntries = 0;
          data.tickts.forEach((tickt) => {
            tickt.type = "tickt";
            totalPurchasedEntries += tickt.num_of_entries;
            tickt.date = new Date(tickt.date?._seconds * 1000);
          });

          const validEntries = totalPurchasedEntries - data.meetings.length;
          setUserEntries(validEntries);

          const history = data.meetings.concat(data.tickts);
          history.sort((a, b) => b.date - a.date);

          setUserHistory(history);
        })
        .catch((err) => console.log(err));
    });
  }

  async function RegisterMeeting(meeting) {
    const headers = await GetReq();
    headers.method = "PUT";

    return fetch(
      `http://localhost:5001/nof-app-dev/europe-west3/app/meetings/register/${meeting.id}`,
      headers
    );
  }

  async function UnregisterFromMeeting(meeting) {
    const headers = await GetReq();
    headers.method = "PUT";

    return fetch(
      `http://localhost:5001/nof-app-dev/europe-west3/app/meetings/deregister/${meeting.id}`,
      headers,
      JSON.stringify({ x: 5 })
    );
  }

  useEffect(() => {
    if (currentUser) {
      GetUserInfo();
    }
    if (meetings) {
      setRegistered(FindUserRegisteredMeetings(meetings));
    }
  }, [currentUser, meetings]);

  const value = {
    meetings,
    registered,
    userHistory,
    userEntries,
    RegisterToMeeting: RegisterMeeting,
    UnregisterFromMeeting,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
