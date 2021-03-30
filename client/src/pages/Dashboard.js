import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Collapse } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import UpcomingMeetings from "../components/UpcomingMeetings";
import { useAuth } from "../contexts/AuthContext";
import UserCard from "../components/UserCard";
import CollapseCard from "../components/CollapseCard";
import MeetingHistory from "../components/MeetingHistory";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const history = useHistory();

  /* 
  userHistory = [
    {
      type:meeting
      date:1/2/21 20:30
      title:yoga
      location:gan-yanva
    }
    {
      type:newTickt
      date:10/1/21
      numOfEntry:10
    }
  ]

  */
  const [userHistory, setUserHistory] = useState();

  useEffect(() => {});

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
      >
        <MeetingHistory />
      </CollapseCard>
      <CollapseCard
        cardTitle="כרטיסיות"
        className={cardClassName}
        style={cardStyle}
      ></CollapseCard>
    </>
  );
}
