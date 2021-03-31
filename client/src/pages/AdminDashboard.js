import React from "react";
import {} from "react-bootstrap";
import {} from "react-router-dom";
import UserCard from "../components/UserCard";
import {} from "../contexts/AuthContext";

export default function AdminDashboard() {
  const cardClassName = "text-center mb-4 shadow-sm";
  const cardStyle = { backgroundColor: "#f6f7fb" };

  return (
    <>
      <UserCard ClassName={cardClassName} Style={cardStyle} />
    </>
  );
}
