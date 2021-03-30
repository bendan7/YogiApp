import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Colors from "../constants/Colors";

export default function UserHistoryList(props) {
  const HistoryEntry = (props) => {
    const type = props.type === "meeting" ? "שיעור" : "כרטיסיה";
    const text =
      props.type === "meeting"
        ? `${props.title}-${props.location}`
        : `מספר כניסות: ${props.num_of_entry}`;

    const dateStr = `${props.date.getDate()}/${props.date.getMonth() + 1}`;
    const style =
      props.type === "meeting"
        ? { backgroundColor: Colors.blue }
        : { backgroundColor: Colors.green };

    return (
      <ListGroup.Item className="p-1 bg-" style={style}>
        <div className="d-flex flex-row-reverse ">
          <div className="d-flex justify-content-between w-50 ">
            <div>{type}</div>
            <div>{dateStr}</div>
          </div>
          <div className="w-50">{text}</div>
        </div>
      </ListGroup.Item>
    );
  };

  return (
    <ListGroup className="p-0 m-0">
      {props.entries?.map((entry, index) => {
        return <HistoryEntry key={index} {...entry} />;
      })}
    </ListGroup>
  );
}
