import React, { useState } from "react";
import { Card, Button, Collapse } from "react-bootstrap";

export default function CollapseCard(props) {
  const [open, setOpen] = useState(false);

  return (
    <Card className={props.className} style={props.style}>
      <div className="d-flex flex-row-reverse justify-content-between p-0">
        <h2 className="m-2">{props.cardTitle}</h2>
        <div>
          <Button
            className="m-2"
            variant="secondary"
            onClick={() => setOpen(!open)}
          >
            {open ? "-" : "+"}
          </Button>
        </div>
      </div>
      <Collapse className="p-1" in={open}>
        <Card.Body>{props.children}</Card.Body>
      </Collapse>
    </Card>
  );
}
