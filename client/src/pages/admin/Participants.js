import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

export default function Participants() {
    const [participants, setParticipants] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const { GetHttpReq } = useAuth()

    async function GetAllUsers() {
        const req = await GetHttpReq()
        req.method = 'GET'
        fetch(`${process.env.REACT_APP_BASE_URL}/api/users`, req)
            .then((res) => res.json())
            .then(
                (result) => {
                    setParticipants(result)
                    setIsLoading(false)
                    console.log(result)
                    GetUserInfo(result[2].uid)
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

    return (
        <div>
            <h2 className="mt-4 text-center font-weight-bold">משתתפים</h2>
            {participants.map((element, index) => {
                return <div key={index}>{element.displayName}</div>
            })}
        </div>
    )
}
