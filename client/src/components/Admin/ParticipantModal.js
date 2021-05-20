import React, { useState, useRef, useEffect } from 'react'
import { Button, ListGroup, Modal, Form, Alert } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { useMeetingsContext } from '../../contexts/MeetingContext'
import { useAuth } from '../../contexts/AuthContext'

export default function ParticipantModal({ show, handleClose, participant }) {
    const { GetHttpReq } = useAuth()

    async function GetUserInfo(uid) {
        const req = await GetHttpReq()
        req.method = 'GET'
        fetch(`${process.env.REACT_APP_BASE_URL}/api/userinfo/${uid}`, req)
            .then((res) => res.json())
            .then(
                (result) => {
                    setUserInfo(result)
                    console.log(result)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    const [userInfo, setUserInfo] = useState()

    useEffect(() => {
        if (participant) {
            GetUserInfo(participant.uid)
        }
    }, [participant])

    return (
        <Modal
            className="text-right"
            centered
            scrollable={true}
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>{participant?.displayName}</Modal.Header>
            <Modal.Body>
                <h5>{participant?.displayName}</h5>
            </Modal.Body>
            <Modal.Footer>fotter</Modal.Footer>
        </Modal>
    )
}
