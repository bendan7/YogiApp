import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Collapse } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import UpcomingMeetings from "../components/UpcomingMeetings";
import { useAuth } from "../contexts/AuthContext";
import UserCard from "../components/UserCard";
import CollapseCard from "../components/CollapseCard";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const history = useHistory();

  useEffect(() => {
    if (currentUser.isAdmin) {
      history.push("/admin");
    }
  });

  const cardStyle = { backgroundColor: "#f6f7fb" };
  const cardClassName = "text-center mb-4 shadow-sm ";

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
        cardTitle="היסטורית שיעורים"
        className={cardClassName}
        style={cardStyle}
      ></CollapseCard>
      <CollapseCard
        cardTitle="כרטיסיות"
        className={cardClassName}
        style={cardStyle}
      ></CollapseCard>
    </>
  );
}
