import React, { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function UpcomingMeetings() {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const { currentUser } = useAuth();
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const availableMeetingBackgroundColor = "#e4fafa";
  const unavailableMeetingBackgroundColor = "#faf7e4";
  const RegisteredMeetingBackgroundColor = "#e4fae7";

  useEffect(() => {
    let isMounted = true;
    var upcomingRef = db.ref("upcoming/");
    upcomingRef.on("value", (snapshot) => {
      if (isMounted) {
        setUpcomingMeetings(Object.values(snapshot.val()));
      }
    });
  }, []);

  function RegisterToMeeting(meeting) {
    db.ref("upcoming/")
      .child(meeting.id)
      .child("participates")
      .push({ uid: currentUser.uid });
  }

  function UnregisterFromMeeting(meeting) {
    const regKey = GetRegisterUserKeyToMeeting(meeting);
    console.log(regKey);
    db.ref("upcoming/")
      .child(meeting.id)
      .child("participates")
      .child(regKey)
      .remove();
  }

  const RegisterButton = ({ meeting }) => (
    <Button variant="success" onClick={() => RegisterToMeeting(meeting)}>
      הרשמה
    </Button>
  );

  const UnregisterButton = ({ meeting }) => (
    <Button variant="danger" onClick={() => UnregisterFromMeeting(meeting)}>
      ביטול הרשמה
    </Button>
  );

  const GetRegisterUserKeyToMeeting = (meeting) => {
    if (meeting.participates == null) {
      return null;
    }

    for (const [key, value] of Object.entries(meeting.participates)) {
      if (value.uid === currentUser.uid) {
        return key;
      }
    }

    return null;
  };

  return (
    <ListGroup>
      {upcomingMeetings.map((meeting) => {
        const UserRegistertionKey = GetRegisterUserKeyToMeeting(meeting);
        const numOfPar = meeting.participates
          ? Object.keys(meeting.participates).length
          : 0;

        const availableSeats = meeting.max_parti - numOfPar;
        let style = { borderRadius: "25px" };
        let meetingButton = null;
        let backgroundColor;

        if (UserRegistertionKey == null && availableSeats > 0) {
          backgroundColor = availableMeetingBackgroundColor;
          meetingButton = <RegisterButton meeting={meeting} />;
        } else if (UserRegistertionKey != null) {
          backgroundColor = RegisteredMeetingBackgroundColor;
          meetingButton = <UnregisterButton meeting={meeting} />;
        } else {
          backgroundColor = unavailableMeetingBackgroundColor;
          meetingButton = <h5>השיעור מלא</h5>;
        }
        style["backgroundColor"] = backgroundColor;

        const date = new Date(meeting.datetime);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1} יום ${
          days[date.getDay()]
        }`;

        return (
          <ListGroup.Item
            key={meeting.id}
            className="mt-2 p-1 border shadow-sm"
            style={style}
          >
            <div className="d-flex justify-content-around ">
              <div>
                <h4 className="m-0">
                  {date.getUTCHours()}:{date.getUTCMinutes()}
                </h4>
                <h5 className="m-0">{dateStr}</h5>
              </div>

              <div className="text-right">
                <h3 className="m-0">{meeting?.title}</h3>
                <h5 className="m-0">מיקום:{meeting?.loctaion}</h5>
              </div>
            </div>
            <div className="mt-2 mb-0 ">
              {meeting.notes ? (
                <p style={{ direction: "rtl" }} className="text-right p-2 m-0">
                  ** {meeting.notes}
                </p>
              ) : null}
              <div>
                {availableSeats > 0 || UserRegistertionKey ? (
                  <small className="m-0">מקומות זמינים: {availableSeats}</small>
                ) : null}
                <div className="m-1">{meetingButton}</div>
              </div>
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
