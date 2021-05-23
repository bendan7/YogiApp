import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useUserContext } from '../../contexts/UserContext'

export default function UserHistoryList({ historyList, maxInfoEntries }) {
    function HistoryEntry(props) {
        const date = new Date(props.date?._seconds * 1000)
        const type = props.type === 'meeting' ? 'שיעור' : 'כרטיסיה'

        let text
        if (props.type === 'meeting') {
            text = `${props.title}-${props.location}`
        } else {
            text = `מספר כניסות: ${props.num_of_entries}`
        }

        const dateStr = `${date?.getDate()}/${date?.getMonth() + 1}`

        let variant = props.type === 'meeting' ? 'info' : 'success'

        return (
            <ListGroup.Item variant={variant} className="p-1">
                <div className="d-flex flex-row-reverse ">
                    <div className="d-flex justify-content-between">
                        <div>{type}-</div>
                        <div>{dateStr}</div>
                    </div>
                    <div className="w-75">{text}</div>
                </div>
            </ListGroup.Item>
        )
    }

    return (
        <ListGroup className="p-0 m-0 text-center">
            {historyList?.map((entry, index) =>
                index < maxInfoEntries ? (
                    <HistoryEntry key={index} {...entry} />
                ) : null
            )}
        </ListGroup>
    )
}
