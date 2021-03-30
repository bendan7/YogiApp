import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import UserCard from "../components/UserCard";
import { useAuth } from "../contexts/AuthContext";

export default function AdminDashboard() {
  const cardClassName = "text-center mb-4 shadow-sm";
  const cardStyle = { backgroundColor: "#f6f7fb" };

  return (
    <>
      <UserCard ClassName={cardClassName} Style={cardStyle} />
    </>
  );
}
