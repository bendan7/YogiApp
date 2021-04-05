import React, { useState, useRef, useEffect } from "react";
import { Button, ListGroup, Modal, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useMeetingsContext } from "../../contexts/MeetingContext";
import firebase from "firebase/app";

export default function MeetingModal({ meeting, ...props }) {
  const [isNewClass, setIsNewClass] = useState();
  const [isEditMode, setIsEditMode] = useState();
  const [date, setDate] = useState();
  const { NewMeeting } = useMeetingsContext();
  const handleClose = props.handleClose;
  const nameRef = useRef();
  const locationRef = useRef();
  const maxPartiRef = useRef();
  const datetimeRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    const isNewClass = meeting ? false : true;
    setIsNewClass(isNewClass);
    //new Date().toJSON();
    isNewClass ? setIsEditMode(true) : setIsEditMode(false);
    const date = isNewClass ? new Date() : meeting.dateObj;
    setDate(date);
  }, [meeting]);

  const className = "text-right";

  function handleSubmit() {
    console.log("handleSubmit!");

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    console.log(date.toJSON());
    const newMeeting = {
      name: nameRef.current.value,
      location: locationRef.current.value,
      description: descriptionRef.current.value,
      max_parti: maxPartiRef.current.value,
      datetime: date,
      participates: [],
    };

    NewMeeting(newMeeting);
  }

  return (
    <Modal
      className="text-right"
      centered
      show={props.show}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <button>Delete/Cancel</button>
        <button onClick={() => setIsEditMode(true)}>EDIT</button>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formBasicName">
          <Form.Label>שם שיעור</Form.Label>
          <Form.Control
            className={className}
            disabled={!isEditMode}
            defaultValue={meeting?.name}
            required
            ref={nameRef}
            type="text"
          />
        </Form.Group>
        <Form.Group controlId="formBasicLocation">
          <Form.Label>מיקום</Form.Label>
          <Form.Control
            className={className}
            disabled={!isEditMode}
            defaultValue={meeting?.location}
            required
            ref={locationRef}
            type="text"
          />
        </Form.Group>
        <Form.Group controlId="formBasicMaxPar">
          <Form.Label>מספר משתתפים מקסימלי</Form.Label>
          <Form.Control
            className={className}
            disabled={!isEditMode}
            defaultValue={meeting?.max_parti}
            required
            ref={maxPartiRef}
            type="number"
          />
        </Form.Group>
        <Form.Group controlId="formBasicDatetime">
          <div className="text-left d-flex justify-content-between">
            <DatePicker
              disabled={!isEditMode}
              selected={date}
              onChange={(date) => setDate(date)}
              showTimeSelect
              dateFormat="MMMM d, h:mm aa"
              ref={datetimeRef}
            />
            <span> תאריך/שעה</span>
          </div>
        </Form.Group>
        <Form.Group controlId="formBasicDescription">
          <Form.Label>תיאור</Form.Label>
          <Form.Control
            className={className}
            disabled={!isEditMode}
            defaultValue={meeting?.description}
            required
            ref={descriptionRef}
            type="text"
          />
        </Form.Group>
        <h5>:רשומים</h5>
        <ListGroup className="p-0 m-0">
          {meeting?.participates.map((par) => (
            <ListGroup.Item key={par.uid} variant="secondary" className="p-1">
              <div className="d-flex justify-content-between flex-row-reverse align-items-center">
                <div className="d-flex justify-content-between">{par.name}</div>
                {isEditMode ? (
                  <Button variant="danger" size="sm">
                    X
                  </Button>
                ) : null}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        {isEditMode ? (
          <Button onClick={handleSubmit}> סיים עריכה</Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit}>
            סיים שיעור
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
