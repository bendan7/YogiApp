import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function UpcomingMeetings() {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const { currentUser } = useAuth();
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const availableMeetingStyle = { backgroundColor: "#c4def6" };
  const unavailableMeetingStyle = { backgroundColor: "#FEF3BD" };
  const RegisteredMeetingStyle = { backgroundColor: "#BDEEB8" };

  useEffect(() => {
    var upcomingRef = db.ref("upcoming/");
    upcomingRef.on("value", (snapshot) => {
      setUpcomingMeetings(Object.values(snapshot.val()));
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

  const RegisterButton = ({ meeting, isActive }) =>
    isActive ? (
      <Button
        size="sm"
        variant="success"
        onClick={() => RegisterToMeeting(meeting)}
      >
        הרשמה
      </Button>
    ) : null;

  const UnregisterButton = ({ meeting }) => (
    <Button
      size="sm"
      variant="danger"
      onClick={() => UnregisterFromMeeting(meeting)}
    >
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
    <div>
      {upcomingMeetings.map((meeting) => {
        const UserRegistertionKey = GetRegisterUserKeyToMeeting(meeting);
        const numOfPar = meeting.participates
          ? Object.keys(meeting.participates).length
          : 0;

        const availableSeats = meeting.max_parti - numOfPar;

        let style = {};
        if (UserRegistertionKey == null && availableSeats > 0) {
          style = availableMeetingStyle;
        } else if (UserRegistertionKey != null) {
          style = RegisteredMeetingStyle;
        } else {
          style = unavailableMeetingStyle;
        }

        const date = new Date(meeting.datetime);
        const dateStr = `${date.getDate()}/${date.getMonth() + 1} יום ${
          days[date.getDay()]
        }`;

        return (
          <div key={meeting.id} className="mt-2 p-1 border " style={style}>
            <div className="d-flex justify-content-around ">
              <div>
                <div>
                  {date.getUTCHours()}:{date.getUTCMinutes()}
                </div>
                <h6>{dateStr}</h6>
              </div>
              <h4>
                {meeting?.title} - {meeting?.loctaion}
              </h4>
            </div>
            <div className="d-flex justify-content-around "></div>

            <div className="d-flex justify-content-around ">
              {UserRegistertionKey != null ? (
                <UnregisterButton meeting={meeting} />
              ) : (
                <RegisterButton
                  meeting={meeting}
                  isActive={availableSeats > 0}
                />
              )}
              <p className="align-self-end">מקומות פנוים: {availableSeats}</p>
            </div>
            {meeting.notes ? <div>{meeting.notes}*</div> : null}
          </div>
        );
      })}
    </div>
  );
}
