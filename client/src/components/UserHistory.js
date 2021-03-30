import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

export default function UserHistory() {
  const [userHistory, setUserHistory] = useState([]);
  const { currentUser } = useAuth();

  const MaxHistoryEntries = 23;

  async function GetHistory() {
    var accessToken = null;
    await currentUser.getIdToken().then(function (token) {
      accessToken = token;
    });

    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    fetch("/userhistory", headers).then((res) => {
      res.json().then((data) => {
        data.meetings.forEach((meeting) => {
          meeting.type = "meeting";
          meeting.date = new Date(meeting.date._seconds * 1000);
        });

        data.tickts.forEach((tickt) => {
          tickt.type = "tickt";
          tickt.date = new Date(tickt.date._seconds * 1000);
        });

        const history = data.meetings.concat(data.tickts);
        history.sort((a, b) => b.date - a.date);
        const latestEntries = history.slice(0, MaxHistoryEntries);

        setUserHistory(latestEntries);
      });
    });
  }

  useEffect(() => {
    GetHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const HistoryEntry = (props) => {
    const type = props.type === "meeting" ? "שיעור" : "כרטיסיה";
    const text =
      props.type === "meeting"
        ? `${props.title}-${props.location}`
        : `מספר כניסות: ${props.num_of_entry}`;

    const dateStr = `${props.date.getDate()}/${props.date.getMonth() + 1}`;

    const style =
      props.type === "meeting"
        ? { backgroundColor: "#ebf0fc" }
        : { backgroundColor: "#f3fceb" };
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
      {userHistory.map((entry, index) => {
        return <HistoryEntry key={index} {...entry} />;
      })}
    </ListGroup>
  );
}
