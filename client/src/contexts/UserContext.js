import React, { useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { useMeetingsContext } from './MeetingContext'

const UserContext = React.createContext()

export function useUserContext() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const { currentUser, GetHttpReq } = useAuth()

    //upcoming meetings list
    const { meetings } = useMeetingsContext()

    const [isLoading, SetIsLoading] = useState(true)

    // registered upcoming meetings ids list
    const [registered, setRegistered] = useState([])

    // user history is list of meeting and tickt purchases
    // the sum of left entries is calc by the user history AllTickts-AllMeetings
    const [userHistory, setUserHistory] = useState([])
    const [userEntries, setUserEntries] = useState(0)

    function FindUserRegisteredMeetings(meetingList) {
        const RegList = []

        meetingList?.forEach((meeting) => {
            meeting.participates?.forEach((par) => {
                if (par.uid === currentUser.uid) {
                    RegList.push(meeting.id)
                }
            })
        })

        return RegList
    }

    async function GetUserInfo() {
        const req = await GetHttpReq()
        req.method = 'GET'

        fetch(`${process.env.REACT_APP_BASE_URL}/api/userinfo`, req)
            .then((res) => {
                res.json()
                    .then((data) => {
                        setUserHistory(data.history)
                        setUserEntries(data.remainsEntries)
                        SetIsLoading(false)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log('faild to get user info')
            })
    }

    async function RegisterMeeting(meeting) {
        SetIsLoading(true)
        const httpReq = await GetHttpReq()
        httpReq.method = 'PUT'
        return fetch(
            `${process.env.REACT_APP_BASE_URL}/api/meetings/register/${meeting.id}`,
            httpReq
        ).finally(() => SetIsLoading(false))
    }

    async function UnregisterFromMeeting(meeting) {
        SetIsLoading(true)
        const httpReq = await GetHttpReq()
        httpReq.method = 'PUT'
        return fetch(
            `${process.env.REACT_APP_BASE_URL}/api/meetings/deregister/${meeting.id}`,
            httpReq
        ).finally(() => SetIsLoading(false))
    }

    // On component mount with user
    useEffect(() => {
        if (currentUser) {
            GetUserInfo()
        }
    }, [currentUser])

    // On meetings change
    useEffect(() => {
        if (meetings) {
            setRegistered(FindUserRegisteredMeetings(meetings))
        }
    }, [meetings])

    const value = {
        registered,
        userHistory,
        userEntries,
        isLoading,
        RegisterToMeeting: RegisterMeeting,
        UnregisterFromMeeting,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
