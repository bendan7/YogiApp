import React, { useEffect, useState } from 'react'
import { Button, ListGroup } from 'react-bootstrap'

import { Link } from 'react-router-dom'
import MeetingModal from '../../components/Admin/MeetingModal'
import { useMeetingsContext } from '../../contexts/MeetingContext'

export default function Meetings() {
    const { meetings } = useMeetingsContext()

    // modal
    const [selectedMeetingIndex, setSelectedMeetingIndex] = useState()
    const [showModal, setShowModal] = useState(false)
    const handleClose = () => setShowModal(false)

    const handleShow = (meetingIndex) => {
        setSelectedMeetingIndex(meetingIndex)
        setShowModal(true)
    }

    return (
        <div>
            <h1 className="mt-5 text-center">מפגשים קרובים</h1>
            <Button
                variant="success mb-3"
                onClick={() => handleShow(null)}
                block
            >
                הוסף מפגש
            </Button>
            <MeetingModal
                show={showModal}
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
                                <div className="w-100 pr-2 pl-2 text-center">
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
