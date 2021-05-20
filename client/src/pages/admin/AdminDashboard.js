import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Header from '../../components/Header'
import {} from '../../contexts/AuthContext'

export default function AdminDashboard() {
    const cardClassName = 'text-center mb-4 shadow-sm'
    const cardStyle = { backgroundColor: '#f6f7fb' }

    return (
        <>
            <Header ClassName={cardClassName} Style={cardStyle} />
            <h3 className="text-center">פאנל ניהול</h3>
            <Link to="/meetings">
                <Button className="mb-2" size="lg" block>
                    שיעורים
                </Button>
            </Link>

            <Link to="/participants">
                <Button className="mb-2" size="lg" block>
                    משתתפים
                </Button>
            </Link>

            <Button size="lg" block disabled>
                דוחות
            </Button>
        </>
    )
}
