import React, { useState, useRef, useEffect } from 'react'
import { Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { useMeetingsContext } from '../../contexts/MeetingContext'

export default function MeetingModal({ meeting, ...props }) {
    const [isNewMeeting, setIsNewMeeting] = useState()
    const [isEditMode, setIsEditMode] = useState()
    const [errorMsg, setErrorMsg] = useState()

    const { CreateMeeting, DeleteMeeting, UpdateMeeting } = useMeetingsContext()
    const handleClose = props.handleClose

    const [date, setDate] = useState()

    const nameRef = useRef()
    const locationRef = useRef()
    const maxPartiRef = useRef()
    const datetimeRef = useRef()
    const descriptionRef = useRef()

    useEffect(() => {
        const isNewClass = meeting ? false : true
        setIsNewMeeting(isNewClass)

        isNewClass ? setIsEditMode(true) : setIsEditMode(false)
        const date = isNewClass ? new Date() : meeting.dateObj
        setDate(date)
        setErrorMsg()
    }, [meeting, props.show])

    const className = 'text-right'

    function ValidFields() {
        let errors = []

        if (nameRef.current.value.length < 3) {
            errors.push('שם השיעור לא תקין')
        }
        if (locationRef.current.value.length < 3) {
            errors.push('מיקום השיעור לא תקין')
        }
        if (maxPartiRef.current.value < 1) {
            errors.push('מספר משתתפים לא תקין')
        }
        const now = new Date()
        if (date - now < 0) {
            errors.push('תאריך/שעה לא תקינים')
        }
        return errors
    }

    function GetMeetingObjFromFields() {
        return {
            name: nameRef.current.value,
            location: locationRef.current.value,
            description: descriptionRef.current.value,
            max_parti: maxPartiRef.current.value,
            datetime: date,
            participates: [],
        }
    }

    function OnNewMeeting(e) {
        e.preventDefault()

        const errors = ValidFields()
        if (errors.length > 0) {
            setErrorMsg(errors.join(', '))
            return
        }

        const newMeeting = GetMeetingObjFromFields()

        CreateMeeting(newMeeting)
            .then(() => {
                handleClose()
            })
            .catch(() => {
                setErrorMsg('נכשל ביצירת המפגש')
            })
    }

    function OnUpdateMeeting(e) {
        e.preventDefault()

        const errors = ValidFields()

        if (errors.length > 0) {
            setErrorMsg(errors.join(', '))
            return
        }
        const newMeeting = GetMeetingObjFromFields()

        UpdateMeeting(meeting.id, newMeeting)
            .then(() => {
                setIsEditMode(false)
            })
            .catch((err) => {
                setErrorMsg('נכשל בעדכון הפרטים')
            })
    }

    function OnDeleteMeeting(e) {
        e.preventDefault()

        setIsEditMode(false)

        DeleteMeeting(meeting.id)
            .then(() => {
                handleClose()
            })
            .catch(() => {
                setErrorMsg('נכשל במחיקת השיעור')
            })
    }

    function GetModalAction() {
        let actionNeme
        let buttVariant
        let action

        if (isEditMode && isNewMeeting) {
            //Create new meeting
            actionNeme = 'צור מפגש חדש'
            buttVariant = 'success'
            action = OnNewMeeting
        } else if (isEditMode && !isNewMeeting) {
            //Edit mode of existing meeting
            actionNeme = 'עדכן פרטים'
            buttVariant = 'success'
            action = OnUpdateMeeting
        } else {
            //View mode of existing meeting
            actionNeme = 'סיים שיעור'
            buttVariant = 'primary'
            action = null
        }

        return (
            <Button block variant={buttVariant} onClick={action}>
                {actionNeme}
            </Button>
        )
    }

    function GetModalHeader() {
        if (isEditMode && isNewMeeting) {
            //Create new meeting
            return <h3>מפגש חדש</h3>
        } else if (isEditMode && !isNewMeeting) {
            //Edit mode of existing meeting
            return (
                <Button variant="danger" size="sm" onClick={OnDeleteMeeting}>
                    Delete/Cancel
                </Button>
            )
        } else {
            //View mode of existing meeting
            return (
                <Button variant="warning" onClick={() => setIsEditMode(true)}>
                    EDIT
                </Button>
            )
        }
    }

    function RemovePar(uid) {
        const newMeeting = GetMeetingObjFromFields()

        newMeeting.participates = meeting.participates.filter(
            (par) => par.uid !== uid
        )
        UpdateMeeting(meeting.id, newMeeting).catch((err) => {
            setErrorMsg('נכשל בעדכון הפרטים')
            setIsEditMode(false)
        })
    }

    return (
        <Modal
            className="text-right"
            centered
            scrollable={true}
            show={props.show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>{GetModalHeader()}</Modal.Header>
            <Modal.Body>
                {errorMsg ? <Alert variant="danger">{errorMsg}</Alert> : null}
                <Form.Group controlId="formBasicName">
                    <Form.Label>שם מפגש</Form.Label>
                    <Form.Control
                        className={className}
                        disabled={!isEditMode}
                        defaultValue={meeting?.name}
                        required
                        ref={nameRef}
                        type="text"
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
                    <h5>:רשומים</h5>
                    <PrticipatesList
                        participates={meeting?.participates}
                        editable={isEditMode}
                        onDelete={RemovePar}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>{GetModalAction()}</Modal.Footer>
        </Modal>
    )
}

function PrticipatesList({ participates, editable, onDelete }) {
    return (
        <>
            <Button>הוסף משתתף</Button>
            <ListGroup className="p-0 m-0">
                {participates?.map((par) => (
                    <ListGroup.Item
                        key={par.uid}
                        variant="secondary"
                        className="p-1"
                    >
                        <div className="d-flex justify-content-between flex-row-reverse align-items-center">
                            <div className="d-flex justify-content-between">
                                {par.name}
                            </div>
                            {editable ? (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => onDelete(par.uid)}
                                >
                                    X
                                </Button>
                            ) : null}
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    )
}
