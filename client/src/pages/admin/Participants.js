import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Button, ListGroup, InputGroup, FormControl } from 'react-bootstrap'
import ParticipantModal from '../../components/Admin/ParticipantModal'

export default function Participants() {
    const searchStrRef = useRef()
    const { GetHttpReq } = useAuth()

    const [showModal, setShowModal] = useState(false)
    const handleClose = () => setShowModal(false)

    const [allParticipants, setAllParticipants] = useState([])
    const [filterdParticipants, setFilterdParticipants] = useState([])
    const [selectedPar, setSelectedPar] = useState()
    const [isLoading, setIsLoading] = useState(true)

    async function GetAllUsers() {
        const req = await GetHttpReq()
        req.method = 'GET'
        fetch(`${process.env.REACT_APP_BASE_URL}/api/users`, req)
            .then((res) => res.json())
            .then(
                (result) => {
                    setAllParticipants(result)
                    setFilterdParticipants(result)
                    setIsLoading(false)
                },
                (error) => {
                    console.log(error)
                }
            )
    }

    function selecteParticipant(participant) {
        setSelectedPar(participant)
        setShowModal(true)
    }

    useEffect(() => {
        GetAllUsers()
    }, [])

    function Search(term) {
        const filterList = allParticipants.filter(
            (par) => par.displayName.includes(term) || par.email.includes(term)
        )
        setFilterdParticipants(filterList)
    }

    return (
        <div>
            <h1 className="mt-5 text-center">משתתפים</h1>

            <InputGroup className="mb-3 text-right">
                <FormControl
                    aria-label="Amount (to the nearest dollar)"
                    required
                    ref={searchStrRef}
                    onChange={() => Search(searchStrRef.current.value)}
                    type="text"
                />
                <InputGroup.Append>
                    <InputGroup.Text>חיפוש</InputGroup.Text>
                </InputGroup.Append>
            </InputGroup>
            <h5>
                {filterdParticipants.length}/{allParticipants.length}
            </h5>

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
                                <Button
                                    variant="info"
                                    size="sm"
                                    onClick={() =>
                                        selecteParticipant(participant)
                                    }
                                >
                                    +
                                </Button>
                            </div>
                        </ListGroup.Item>
                    )
                })}
            </ListGroup>
            <ParticipantModal
                show={showModal}
                handleClose={handleClose}
                participant={selectedPar}
            />
        </div>
    )
}
