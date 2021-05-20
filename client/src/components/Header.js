import React, { useState } from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ ClassName, Style, ...props }) {
    const { currentUser, logout } = useAuth()
    const history = useHistory()
    const [error, setError] = useState('')

    async function handleLogout() {
        try {
            await logout()
            history.push('/login')
        } catch (ex) {
            setError('התנתקות נכשלה')
            console.log(ex)
        }
    }

    return (
        <Card className={ClassName} style={Style}>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <Button onClick={handleLogout}>התנתק</Button>
                    </div>
                    <div>
                        <h3 className="m-0 ">
                            {currentUser?.displayName} שלום
                        </h3>
                        <Link className="m-0 p-0" to="update-profile">
                            עדכן פרטים
                        </Link>
                    </div>
                </div>
            </Card.Body>
            {error && (
                <Alert className=" mt-3 mb-0 text-center" variant="danger">
                    {error}
                </Alert>
            )}
        </Card>
    )
}
