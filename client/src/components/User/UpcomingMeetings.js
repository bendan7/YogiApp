import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { useUserContext } from "../../contexts/UserContext";

//This component is conncted to realtime db
export default function UpcomingMeetings(props) {
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

  const {
    meetings,
    registered,
    userEntries,
    RegisterToMeeting,
    UnregisterFromMeeting,
  } = useUserContext();

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
      {meetings.map((meeting, index) => {
        const numOfPar = meeting.participates
          ? Object.keys(meeting.participates).length
          : 0;

        const availableSeats = meeting.max_parti - numOfPar;

        let meetingOptions = null;
        let variant;

        const isUserReg = registered.includes(meeting.id);

        if (!isUserReg && availableSeats > 0) {
          // meeting avalivble to regstration
          variant = "info";

          const isEntriesLeft = userEntries - registered.length;
          if (isEntriesLeft > 0) {
            meetingOptions = <RegisterButton meeting={meeting} />;
          }
        } else if (isUserReg) {
          // user is regsterd to this meeting
          meetingOptions = <UnregisterButton meeting={meeting} />;
          variant = "success";
        } else {
          // meeting is full
          variant = "warning";
          meetingOptions = <h5 className="font-weight-bold">השיעור מלא</h5>;
        }

        return (
          <ListGroup.Item
            variant={variant}
            key={index}
            className="mt-2 p-1 border shadow-sm rounded"
            //style={style}
          >
            <div>
              <div className="d-flex justify-content-around ">
                <div>
                  <h4 className="m-0">{meeting.time}</h4>
                  <h5 className="m-0">{`${meeting.date} יום ${meeting.dayName}`}</h5>
                </div>
                <div className="text-right">
                  <h3 className="m-0">{meeting?.name}</h3>
                  <h5 className="m-0">מיקום:{meeting?.location}</h5>
                </div>
              </div>
              <div className="mt-2 mb-0 ">
                {meeting.description ? (
                  <p
                    style={{ direction: "rtl" }}
                    className="text-right p-2 m-0"
                  >
                    ** {meeting.description}
                  </p>
                ) : null}
                <div>
                  {availableSeats > 0 || isUserReg ? (
                    <small className="m-0">
                      מקומות זמינים: {availableSeats}
                    </small>
                  ) : null}
                  <div className="m-1">{meetingOptions}</div>
                </div>
              </div>
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
