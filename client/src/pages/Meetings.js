import React, { useEffect, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";

import {} from "react-router-dom";
import MeetingModal from "../components/Admin/MeetingModal";
import { useMeetingsContext } from "../contexts/MeetingContext";

export default function Meetings() {
  const { meetings } = useMeetingsContext();

  //modal
  const [selectedMeeting, setSelectedMeeting] = useState();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (meeting) => {
    setSelectedMeeting(meeting);
    setShow(true);
  };

  return (
    <div>
      <h1 className="mt-4 text-center font-weight-bold">שיעורים</h1>
      <Button onClick={() => handleShow(null)} block>
        שיעור חדש
      </Button>
      <h3 className="mt-4 text-right font-weight-bold">שיעורים קרובים</h3>

      <MeetingModal
        show={show}
        handleClose={handleClose}
        meeting={selectedMeeting}
      />

      <ListGroup className="p-0 m-0">
        {meetings?.map((meeting) => {
          return (
            <ListGroup.Item key={meeting.id} variant={"info"} className="p-1">
              <div className="d-flex justify-content-between flex-row-reverse align-items-center">
                <div className="d-flex justify-content-between">
                  <div className="mr-2">{meeting.time}</div>
                  <div className="mr-2">{meeting.dayName}</div>
                  <div>{meeting.date}</div>
                </div>
                <div>
                  {meeting.name}- {meeting.location}
                </div>
                <Button
                  onClick={() => handleShow(meeting)}
                  variant="info"
                  size="sm"
                >
                  +
                </Button>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}
