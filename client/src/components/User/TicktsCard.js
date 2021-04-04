import React from "react";
import { Card } from "react-bootstrap";
import { useUserContext } from "../../contexts/UserContext";

export default function TicktsCard({ ClassName, Style, ...props }) {
  const { registered, userEntries } = useUserContext();

  return (
    <Card className={ClassName} style={Style}>
      <Card.Body className="p-1">
        <h5 className=" m-0 p-0 font-weight-bold">
          כניסות בכרטיסיה: {userEntries - registered.length}
        </h5>
      </Card.Body>
    </Card>
  );
}
