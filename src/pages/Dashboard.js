import React, { useState } from "react";
import { Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import UpcomingMeetings from "../components/UpcomingMeetings";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    try {
      await logout();
      history.push("/login");
    } catch (ex) {
      setError("התנתקות נכשלה");
      console.log(ex);
    }
  }

  return (
    <>
      <Card className="text-center mb-4">
        <Card.Body>
          <div>{currentUser?.email}</div>
          <Link to="update-profile">עדכן פרטים</Link>
          <Button onClick={handleLogout}>התנתק</Button>
        </Card.Body>
        {error && (
          <Alert className=" mt-3 mb-0 text-center" variant="danger">
            {error}
          </Alert>
        )}
      </Card>
      <Card className="text-center mb-4">
        <Card.Body>
          <h2>רישום לשיעורים</h2>
          <UpcomingMeetings />
        </Card.Body>
      </Card>
      <Card className="text-center mb-4">
        <Card.Body>
          <h2>היסטורית שיעורים</h2>
        </Card.Body>
      </Card>
      <Card className="text-center ">
        <Card.Body>
          <h2>כרטיסיות</h2>
        </Card.Body>
      </Card>
    </>
  );
}
