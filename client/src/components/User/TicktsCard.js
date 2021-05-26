import React from 'react'
import { Card, Spinner } from 'react-bootstrap'
import { useUserContext } from '../../contexts/UserContext'

export default function TicktsCard({ ClassName, Style, ...props }) {
    const { registered, userEntries, isLoading } = useUserContext()

    return (
        <Card className={ClassName} style={Style}>
            <Card.Body className="p-1">
                {isLoading ? (
                    <div>
                        <Spinner
                            className="m-1"
                            animation="border"
                            variant="info"
                        />
                    </div>
                ) : (
                    <h5 className=" m-0 p-0 font-weight-bold">
                        כניסות בכרטיסיה: {userEntries - registered.length}
                    </h5>
                )}
            </Card.Body>
        </Card>
    )
}
