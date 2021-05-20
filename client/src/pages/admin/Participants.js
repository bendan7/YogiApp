import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button, ListGroup, InputGroup, FormControl } from 'react-bootstrap'

export default function Participants() {
    const [participants, setParticipants] = useState([])
    const [filterdParticipants, setFilterdParticipants] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const searchRef = useRef()
    const { GetHttpReq } = useAuth()

    async function GetAllUsers() {
        const req = await GetHttpReq()
        req.method = 'GET'
        fetch(`${process.env.REACT_APP_BASE_URL}/api/users`, req)
            .then((res) => res.json())
            .then(
                (result) => {
                    setParticipants(result)
                    setFilterdParticipants(result)
                    setIsLoading(false)
                    console.log(result)
                    GetUserInfo(result[1].uid)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    async function GetUserInfo(uid) {
        const req = await GetHttpReq()
        req.method = 'GET'
        fetch(`${process.env.REACT_APP_BASE_URL}/api/userinfo/${uid}`, req)
            .then((res) => res.json())
            .then(
                (result) => {
                    console.log(result)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    useEffect(() => {
        GetAllUsers()
    }, [])

    function Search(term) {
        const filterList = participants.filter(
            (par) => par.displayName.includes(term) || par.email.includes(term)
        )
        setFilterdParticipants(filterList)
    }

    return (
        <div>
            <h2 className="mt-4 text-center font-weight-bold">משתתפים</h2>

            <InputGroup className="mb-3 text-right">
                <FormControl
                    aria-label="Amount (to the nearest dollar)"
                    required
                    ref={searchRef}
                    onChange={() => Search(searchRef.current.value)}
                    type="text"
                />
                <InputGroup.Append>
                    <InputGroup.Text>חיפוש</InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>

            <ListGroup className="p-0 m-0">
                {filterdParticipants?.map((participant, index) => {
                    return (
                        <ListGroup.Item
                            key={participant.uid}
                            variant={'info'}
                            className="p-1"
                        >
                            <div className="d-flex justify-content-between flex-row-reverse align-items-center">
                                <div className="mr-2">
                                    {participant.displayName}
                                </div>
                                <Button variant="info" size="sm">
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
