import React, { useState, useEffect } from "react";
import UpcomingMeetings from "../components/UpcomingMeetings";
import { useAuth } from "../contexts/AuthContext";
import { useRegistration } from "../contexts/RegistrationContext";
import UserCard from "../components/UserCard";
import CollapseCard from "../components/CollapseCard";
import UserHistoryList from "../components/UserHistoryList";
import { db } from "../firebase";

export default function UserDashboard() {
  const cardsStyle = { backgroundColor: "#f6f7fb" };
  const cardsClassName = "text-center mb-4 p-1 shadow-sm";
  const MaxInfoEntries = 23;

  const { currentUser } = useAuth();
  const {} = useRegistration();

  const [userHistory, setUserHistory] = useState([]);

  const [validEntries, setValidEntries] = useState();
  const [meetings, setMeetings] = useState([]);
  const [registered, setRegistered] = useState([]);

  async function GetUserInfo() {
    var accessToken = null;
    await currentUser.getIdToken().then(function (token) {
      accessToken = token;
    });

    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

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
        setValidEntries(validEntries);

        const history = data.meetings.concat(data.tickts);
        history.sort((a, b) => b.date - a.date);
        const latestEntries = history.slice(0, MaxInfoEntries);

        setUserHistory(latestEntries);
      });
    });
  }

  function GetUpcomingMeetings() {
    var upcomingRef = db.ref("upcoming/");

    upcomingRef.on("value", (snapshot) => {
      // REALTIME DB - onChange
      const newMeetings = Object.values(snapshot.val());
      setMeetings(newMeetings);

      const RegisteredMeeting = GetRegisteredMeetings(newMeetings);
      setRegistered(RegisteredMeeting);
    });
  }

  function GetRegisteredMeetings(meetingList) {
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

  function RegisterToMeeting(meeting) {
    db.ref("upcoming/")
      .child(meeting.id)
      .child("participates")
      .push({ uid: currentUser.uid });
  }

  function UnregisterFromMeeting(meeting) {
    let regKey;

    if (meeting.participates == null) {
      return null;
    }

    for (const [key, value] of Object.entries(meeting.participates)) {
      if (value.uid === currentUser.uid) {
        regKey = key;
      }
    }

    if (regKey) {
      db.ref("upcoming/")
        .child(meeting.id)
        .child("participates")
        .child(regKey)
        .remove();
    }
  }

  useEffect(() => {
    GetUpcomingMeetings();
    GetUserInfo();
  }, []);

  return (
    <>
      <UserCard
        ClassName={cardsClassName}
        Style={cardsStyle}
        validEntries={validEntries - registered.length}
      />
      <CollapseCard
        cardTitle="רישום לשיעורים"
        className={cardsClassName}
        style={cardsStyle}
      >
        <UpcomingMeetings meetings={meetings} />
      </CollapseCard>

      <CollapseCard
        cardTitle="מעקב השתתפויות"
        className={cardsClassName}
        style={cardsStyle}
      >
        <UserHistoryList entries={userHistory} />
      </CollapseCard>
    </>
  );
}
