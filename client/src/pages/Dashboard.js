import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import UpcomingMeetings from "../components/UpcomingMeetings";
import { useAuth } from "../contexts/AuthContext";
import UserCard from "../components/UserCard";
import CollapseCard from "../components/CollapseCard";
import UserHistory from "../components/UserHistory";

export default function Dashboard() {
  useEffect(() => {});
  const cardStyle = { backgroundColor: "#f6f7fb" };
  const cardClassName = "text-center mb-4 p-1 shadow-sm";

  return (
    <>
      <UserCard ClassName={cardClassName} Style={cardStyle} />
      <CollapseCard
        cardTitle="רישום לשיעורים"
        className={cardClassName}
        style={cardStyle}
      >
        <UpcomingMeetings />
      </CollapseCard>

      <CollapseCard
        cardTitle="מעקב השתתפויות"
        className={cardClassName}
        style={cardStyle}
      >
        <UserHistory />
      </CollapseCard>
    </>
  );
}
