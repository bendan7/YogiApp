import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      history.push("/");
    }
  });

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push("/");
    } catch (e) {
      console.log(`${e?.message} `);
      setError(`${e?.message} `);
    }
  }

  return (
    <>
      <Card>
        <Card.Body className="text-center">
          <h2>התחברות</h2>
          <Form onSubmit={handleSubmit} className="text-right">
            <Form.Group>
              <Form.Label>דואר אלקטרוני</Form.Label>
              <Form.Control id="email" type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>סיסמא</Form.Label>
              <Form.Control
                id="password"
                type="password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Button disabled={loading} className="w-100 " type="submit">
              התחברות
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="forgot-password">? שכחת סיסמה</Link>
          </div>
          {error && (
            <Alert className=" mt-3 mb-0 text-center" variant="danger">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        אין לך חשבון? <Link to="/signup">צור חשבון חדש</Link>
      </div>
    </>
  );
}
