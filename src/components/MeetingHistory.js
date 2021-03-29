import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { firestore } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState([]);
  const { currentUser } = useAuth();
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  useEffect(() => {
    let isMounted = true;
    // getuser history
  }, []);

  return (
    <ListGroup>
      {meetings.map((meeting) => {
        const date = new Date(meeting.datetime);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1} יום ${
          days[date.getDay()]
        }`;

        return (
          <ListGroup.Item
            key={meeting.id}
            className="mt-2 p-1 border shadow-sm"
          >
            <div className="d-flex justify-content-around ">
              {meeting.title}
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
