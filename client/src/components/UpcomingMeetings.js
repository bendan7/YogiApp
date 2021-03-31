import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import Colors from "../constants/Colors";
import { useRegistration } from "../contexts/RegistrationContext";

//This component is conncted to realtime db
export default function UpcomingMeetings(props) {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const {
    meetings,
    registered,
    userEntries,
    RegisterToMeeting,
    UnregisterFromMeeting,
  } = useRegistration();

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

  return (
    <ListGroup>
      {meetings.map((meeting) => {
        const numOfPar = meeting.participates
          ? Object.keys(meeting.participates).length
          : 0;

        const availableSeats = meeting.max_parti - numOfPar;

        let meetingOptions = null;
        let backgroundColor;

        const isUserReg = registered.includes(meeting.id);

        if (!isUserReg && availableSeats > 0) {
          // meeting avalivble to regstration
          backgroundColor = Colors.blue;

          const isEntriesLeft = userEntries - registered.length;
          if (isEntriesLeft > 0) {
            meetingOptions = <RegisterButton meeting={meeting} />;
          }
        } else if (isUserReg) {
          // user is regsterd to this meeting
          backgroundColor = Colors.green;
          meetingOptions = <UnregisterButton meeting={meeting} />;
        } else {
          // meeting is full
          backgroundColor = Colors.red;
          meetingOptions = <h5 className="font-weight-bold">השיעור מלא</h5>;
        }

        let style = { borderRadius: "25px", backgroundColor: backgroundColor };

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
                {availableSeats > 0 || isUserReg ? (
                  <small className="m-0">מקומות זמינים: {availableSeats}</small>
                ) : null}
                <div className="m-1">{meetingOptions}</div>
              </div>
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
