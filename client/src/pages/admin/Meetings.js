import React, { useEffect, useState } from 'react'
import { Button, ListGroup } from 'react-bootstrap'

import { Link } from 'react-router-dom'
import MeetingModal from '../../components/Admin/MeetingModal'
import { useMeetingsContext } from '../../contexts/MeetingContext'

export default function Meetings() {
    const { meetings } = useMeetingsContext()

    // modal
    const [selectedMeetingIndex, setSelectedMeetingIndex] = useState()
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)

    const handleShow = (meetingIndex) => {
        setSelectedMeetingIndex(meetingIndex)
        setShow(true)
    }

    return (
        <div>
            <Link to="/admin">
                <Button onClick={() => handleShow(null)} block>
                    תפריט ראשי
                </Button>
            </Link>

            <h1 className="mt-4 text-center font-weight-bold">מפגשים</h1>

            <h3 className="mt-0 text-right font-weight-bold">מפגשים קרובים</h3>
            <Button
                variant="success mb-2"
                onClick={() => handleShow(null)}
                block
            >
                הוסף מפגש
            </Button>
            <MeetingModal
                show={show}
                handleClose={handleClose}
                meeting={
                    selectedMeetingIndex != null
                        ? meetings[selectedMeetingIndex]
                        : null
                }
            />

            <ListGroup className="p-0 m-0">
                {meetings?.map((meeting, index) => {
                    return (
                        <ListGroup.Item
                            key={meeting.id}
                            variant={'info'}
                            className="p-1"
                        >
                            <div className="d-flex justify-content-between flex-row-reverse align-items-center">
                                <div className="d-flex justify-content-between">
                                    <div className="mr-2">{meeting.time}</div>
                                    <div className="mr-2">
                                        {meeting.dayName}
                                    </div>
                                    <div>{meeting.date}</div>
                                </div>
                                <div className="w-100 pr-2 pl-2 text-right">
                                    {meeting.name}-{meeting.location}
                                </div>
                                <Button
                                    onClick={() => handleShow(index)}
                                    variant="info"
                                    size="sm"
                                >
                                    +
                                </Button>
                            </div>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
        </div>
    )
}
