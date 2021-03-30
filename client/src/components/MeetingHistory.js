import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { firestore } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function MeetingHistory() {
  const [meetings, setMeetings] = useState([]);
  const { currentUser } = useAuth();
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

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
      res.text().then((data) => {
        console.log(data);
      });
    });

    //console.log(headers);
  }

  useEffect(() => {
    GetHistory();

    let isMounted = true;
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
