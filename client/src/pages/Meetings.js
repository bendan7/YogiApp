import React from "react";
import { Button, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Meetings() {
  return (
    <div>
      <h1 className="mt-4 text-center font-weight-bold">שיעורים</h1>
      <Button block>שיעור חדש</Button>
      <h3 className="mt-4 text-right font-weight-bold">שיעורים עתידים</h3>
      <ListGroup className="p-0 m-0">
        <ListGroup.Item variant={"info"} className="p-1">
          <div className="d-flex justify-content-between flex-row-reverse align-items-center">
            <div className="d-flex justify-content-between">
              <div>19:30-</div>
              <div>12/3</div>
            </div>
            <div>אשטנגה- גןיבנה</div>
            <Button variant="info" size="sm">
              +
            </Button>
          </div>
        </ListGroup.Item>
        <ListGroup.Item variant={"info"} className="p-1">
          <div className="d-flex justify-content-between flex-row-reverse align-items-center">
            <div className="d-flex justify-content-between">
              <div>19:30-</div>
              <div>12/3</div>
            </div>
            <div>אשטנגה- גןיבנה</div>
            <Button variant="info" size="sm">
              +
            </Button>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}
