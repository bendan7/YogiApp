import React, { useContext, useEffect, useState } from 'react'
import { firestore } from '../firebase'
import { useAuth } from './AuthContext'

const UserContext = React.createContext()

export function useMeetingsContext() {
    return useContext(UserContext)
}

export function MeetingProvider({ children }) {
    const { currentUser } = useAuth()
    const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

    //upcoming meetings list
    const [meetings, setMeetings] = useState()

    // REALTIME DB - onChange
    function ConnectMeetingsDB() {
        return firestore
            .collection('upcoming')
            .orderBy('datetime')
            .onSnapshot((snapshot) => {
                const newMeetings = snapshot.docs.map((doc) => {
                    const meetingObj = doc.data()
                    meetingObj.id = doc.id

                    //timestamp to date
                    const date = new Date(meetingObj.datetime.seconds * 1000)

                    //Add extra date and time strings for UI
                    meetingObj.dateObj = date
                    meetingObj.date = `${date.getDate()}/${date.getMonth() + 1}`
                    meetingObj.dayName = days[date.getDay()]
                    meetingObj.time = `${date.getHours()}:${
                        (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
                    }`

                    return meetingObj
                })
                setMeetings(newMeetings)
            })
    }

    //those functions are protected by security rules. Only admins can edit meetings
    async function CreateMeeting(meeting) {
        return firestore.collection('upcoming').add(meeting)
    }
    function DeleteMeeting(meetingId) {
        return firestore.collection('upcoming').doc(meetingId).delete()
    }
    function UpdateMeeting(meetingId, meeting) {
        return firestore.collection('upcoming').doc(meetingId).update(meeting)
    }

    useEffect(() => {
        if (currentUser) {
            ConnectMeetingsDB()
        }
    }, [currentUser])

    const value = {
        meetings,
        CreateMeeting,
        DeleteMeeting,
        UpdateMeeting,
    }

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
