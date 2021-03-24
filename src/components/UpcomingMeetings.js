import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function UpcomingMeetings() {
  const [upcomming, setUpcoming] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    var upcomingRef = db.ref("upcoming/");
    upcomingRef.on("value", (snapshot) => {
      const meetings = [];

      snapshot.forEach((child) => {
        var meet = child.val();

        meetings.push({
          id: meet.id,
          title: meet.title,
          date: new Date(meet.datetime),
          location: meet.loctaion,
          notes: meet.notes,
          max_parti: meet.max_parti,
          participatesIds: meet.participates ?? [],
        });
      });

      setUpcoming(meetings);
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
    if (meeting == null) {
      return false;
    }

    for (const [key, value] of Object.entries(meeting.participatesIds)) {
      if (value.uid === currentUser.uid) {
        return key;
      }
    }

    return null;
  };

  return (
    <div>
      {upcomming.map((meeting) => (
        <div key={meeting.id} className="w-100 mt-2 p-1 border border-success ">
          <div className="d-flex justify-content-around">
            <h5>
              {meeting?.date.getDay()}/{meeting?.date.getMonth()} יום שלישי
            </h5>
            <h5>
              {meeting?.title} - {meeting?.location}
            </h5>
          </div>
          <h4 className="m-2">
            {meeting?.date.getUTCHours()}:{meeting?.date.getUTCMinutes()}
          </h4>
          <div className="d-flex justify-content-around align-self-center">
            <p>
              מקומות פנויים:{" "}
              {meeting.max_parti -
                Object.keys(meeting?.participatesIds)?.length}
            </p>
            {GetRegisterUserKeyToMeeting(meeting) != null ? (
              <UnregisterButton meeting={meeting} />
            ) : (
              <RegisterButton meeting={meeting} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
