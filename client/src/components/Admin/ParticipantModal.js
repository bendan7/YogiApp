import React, { useState, useRef, useEffect } from 'react'
import { Button, Modal, Form, Alert, Spinner } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css'
import { useAuth } from '../../contexts/AuthContext'
import UserHistoryList from '../User/UserHistoryList'
import { firestore as db } from '../../firebase'
import firebase from 'firebase/app'

export default function ParticipantModal({ show, handleClose, participant }) {
    const { GetHttpReq } = useAuth()
    const [userInfo, setUserInfo] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isEditable, setEditable] = useState(false)

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

    async function addNewTickt(uid) {
        console.log()
        setIsLoading(true)
        db.collection('tickts')
            .add({
                date: firebase.firestore.Timestamp.now(),
                num_of_entries: 10,
                uid: participant.uid,
            })
            .then(() => {
                GetUserInfo(participant.uid)
            })
    }

    async function deleteHistoryEntry(entry) {
        setIsLoading(true)
        const dbName = entry.type === 'meeting' ? 'meetings' : 'tickts'

        if (entry.type === 'tickt') {
            db.collection(dbName)
                .doc(entry.docId)
                .delete()
                .then(() => {
                    GetUserInfo(participant.uid)
                })
        } else if (entry.type === 'meeting') {
            db.collection(dbName)
                .doc(entry.docId)
                .update({
                    participants: firebase.firestore.FieldValue.arrayRemove(
                        `${participant.uid}`
                    ),
                })
                .finally(() => GetUserInfo(participant.uid))
        }
    }

    useEffect(() => {
        if (participant) {
            setEditable(false)
            setIsLoading(true)
            GetUserInfo(participant.uid)
        }
    }, [participant, show])

    return (
        <Modal
            className="text-right"
            centered
            scrollable={true}
            show={show}
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Button
                    variant="warning"
                    onClick={() => setEditable(!isEditable)}
                >
                    {isEditable ? 'סיים עריכה' : 'ערוך'}
                </Button>
            </Modal.Header>
            <Modal.Body>
                <h3>{participant?.displayName}</h3>
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
                            deletable={isEditable}
                            onDeleteEntry={deleteHistoryEntry}
                        />
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={addNewTickt}>כרטיסיה חדשה</Button>
            </Modal.Footer>
        </Modal>
    )
}
