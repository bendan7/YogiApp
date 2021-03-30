import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import UpcomingMeetings from "../components/UpcomingMeetings";
import { useAuth } from "../contexts/AuthContext";
import UserCard from "../components/UserCard";
import CollapseCard from "../components/CollapseCard";
import UserHistoryList from "../components/UserHistoryList";

export default function UserDashboard() {
  const cardsStyle = { backgroundColor: "#f6f7fb" };
  const cardsClassName = "text-center mb-4 p-1 shadow-sm";

  const [userHistory, setUserHistory] = useState([]);
  const { currentUser } = useAuth();

  const MaxHistoryEntries = 23;

  async function GetHistory() {
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

        data.tickts.forEach((tickt) => {
          tickt.type = "tickt";
          tickt.date = new Date(tickt.date._seconds * 1000);
        });

        const history = data.meetings.concat(data.tickts);
        history.sort((a, b) => b.date - a.date);
        const latestEntries = history.slice(0, MaxHistoryEntries);

        setUserHistory(latestEntries);
      });
    });
  }

  useEffect(() => {
    GetHistory();
  }, []);

  return (
    <>
      <UserCard ClassName={cardsClassName} Style={cardsStyle} />
      <CollapseCard
        cardTitle="רישום לשיעורים"
        className={cardsClassName}
        style={cardsStyle}
      >
        <UpcomingMeetings />
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
