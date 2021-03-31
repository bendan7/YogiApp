import React from "react";
import UpcomingMeetings from "../components/UpcomingMeetings";
import UserCard from "../components/UserCard";
import CollapseCard from "../components/CollapseCard";
import UserHistoryList from "../components/UserHistoryList";
import { RegistrationProvider } from "../contexts/RegistrationContext";

export default function UserDashboard() {
  const cardsStyle = { backgroundColor: "#f6f7fb" };
  const cardsClassName = "text-center mb-4 p-1 shadow-sm";
  const maxInfoEntries = 23;

  return (
    <RegistrationProvider>
      <UserCard ClassName={cardsClassName} Style={cardsStyle} />
      <CollapseCard
        cardTitle="רישום לשיעורים"
        className={cardsClassName}
        style={cardsStyle}
      >
        <UpcomingMeetings />
      </CollapseCard>

      <CollapseCard
        cardTitle="היסטוריה"
        className={cardsClassName}
        style={cardsStyle}
      >
        <UserHistoryList maxInfoEntries={maxInfoEntries} />
      </CollapseCard>
    </RegistrationProvider>
  );
}
