import React, { useState } from 'react'
import UpcomingMeetings from '../../components/User/UpcomingMeetings'
import Header from '../../components/Header'
import CollapseCard from '../../components/CollapseCard'
import UserHistoryList from '../../components/User/UserHistoryList'
import { UserProvider } from '../../contexts/UserContext'
import TicktsCard from '../../components/User/TicktsCard'

export default function UserDashboard() {
    const cardsStyle = { backgroundColor: '#f6f7fb' }
    const cardsClassName = 'text-center mb-4 p-1 shadow-sm'
    const maxInfoEntries = 23

    return (
        <UserProvider>
            <Header ClassName={cardsClassName} Style={cardsStyle}></Header>
            <TicktsCard ClassName={cardsClassName} Style={cardsStyle} />
            <CollapseCard
                cardTitle="רישום לשיעורים"
                className={cardsClassName}
                style={cardsStyle}
            >
                <UpcomingMeetings />
            </CollapseCard>

            <CollapseCard
                cardTitle="היסטוריה"
                className={cardsClassName}
                style={cardsStyle}
            >
                <UserHistoryList maxInfoEntries={maxInfoEntries} />
            </CollapseCard>
        </UserProvider>
    )
}
