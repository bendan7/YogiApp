import React, { useState, useRef, useEffect } from 'react'
import { Button, ListGroup, Modal, Form, Alert, Spinner } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'react-datepicker'
import { useMeetingsContext } from '../../contexts/MeetingContext'
import { useAuth } from '../../contexts/AuthContext'
import { useUserContext } from '../../contexts/UserContext'
import UserHistoryList from '../User/UserHistoryList'

export default function ParticipantModal({ show, handleClose, participant }) {
    const { GetHttpReq } = useAuth()
    const [userInfo, setUserInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    async function GetUserInfo(uid) {
        const req = await GetHttpReq()
        req.method = 'GET'
        fetch(`${process.env.REACT_APP_BASE_URL}/api/userinfo/${uid}`, req)
            .then((res) => res.json())
            .then(
                (result) => {
                    setUserInfo(result)
                    setIsLoading(false)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    useEffect(() => {
        if (participant) {
            setIsLoading(true)
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
            <Modal.Header closeButton>
                <h3>{participant?.displayName}</h3>
            </Modal.Header>
            <Modal.Body>
                {isLoading ? (
                    <div className="mt-3 d-flex justify-content-center">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <div>
                        <h5>מספר כניסות בכרטיסיה: {userInfo.remainsEntries}</h5>
                        <UserHistoryList
                            historyList={userInfo.history}
                            maxInfoEntries={1000}
                        />
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>fotter</Modal.Footer>
        </Modal>
    )
}
