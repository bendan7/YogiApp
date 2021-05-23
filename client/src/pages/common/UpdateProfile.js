import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function UpdateProfile() {
    const emailRef = useRef()
    const oldPassRef = useRef()
    const passwordRef = useRef()
    const passwordConfRef = useRef()
    const displayNameRef = useRef()

    const { updateUserPassword, login, currentUser, updateUserDisplayName } =
        useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()
    const [msg, setMsg] = useState()

    function updateDisplayName() {
        setError('')
        setLoading(true)
        updateUserDisplayName(displayNameRef.current.value).then(() => {
            setLoading(false)
            setMsg('הפרטים עודכנו בהצלחה')
        })
    }

    async function updatePassword() {
        try {
            setError('')
            setLoading(true)

            await login(emailRef.current.value, oldPassRef.current.value)
            await updateUserPassword(passwordRef.current.value)

            oldPassRef.current.value = ''
            passwordRef.current.value = ''
            passwordConfRef.current.value = ''
            setMsg('הפרטים עודכנו בהצלחה')
        } catch (e) {
            setError(`${e?.message} `)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfRef.current.value) {
            return setError('הסיסמאות אינן תואומות')
        }

        if (passwordRef.current.value === '') {
            updateDisplayName()
        } else {
            updatePassword()
        }
    }

    return (
        <>
            {msg && (
                <Alert className=" mb-3 mb-0 text-center" variant="info">
                    {msg}
                </Alert>
            )}
            {error && (
                <Alert className=" mb-3 mb-0 text-center" variant="danger">
                    {error}
                </Alert>
            )}
            <Card>
                <Card.Body className="text-center">
                    <h2>שינוי פרטי משתמש</h2>
                    <Form onSubmit={handleSubmit} className="text-right">
                        <Form.Group>
                            <Form.Label>דואר אלקטרוני</Form.Label>
                            <Form.Control
                                id="email"
                                type="email"
                                ref={emailRef}
                                required
                                defaultValue={currentUser.email}
                                disabled
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>שם מלא</Form.Label>
                            <Form.Control
                                id="displayName"
                                type="text"
                                ref={displayNameRef}
                                required
                                defaultValue={currentUser.displayName}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label> סיסמה נוכחית</Form.Label>
                            <Form.Control
                                id="old-password"
                                type="password"
                                ref={oldPassRef}
                                required
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label> סיסמה חדשה</Form.Label>
                            <Form.Control
                                id="new-password"
                                type="password"
                                ref={passwordRef}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>אימות סיסמה חדשה</Form.Label>
                            <Form.Control
                                id="new-password-conf"
                                type="password"
                                ref={passwordConfRef}
                            />
                        </Form.Group>
                        <Button
                            disabled={loading}
                            className="w-100 mb-2"
                            type="submit"
                        >
                            עדכן
                        </Button>
                        <Link to="/">
                            <Button className="w-100 ">חזור</Button>
                        </Link>
                    </Form>
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2"></div>
        </>
    )
}
