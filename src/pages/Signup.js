import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();
  const passwordConfRef = useRef();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfRef.current.value) {
      return setError("הסיסמאות אינן תואומות");
    }

    if (!nameRef.current.value) {
      return setError("שם מלא לא חוקי");
    }

    try {
      setError("");
      setLoading(true);
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        nameRef.current.value
      );
    } catch (e) {
      setError(`${e?.message} `);
      setLoading(false);
      return;
    }

    history.push("/");
  }

  return (
    <>
      <Card>
        <Card.Body className="text-center">
          <h2>משתמש חדש</h2>
          <Form onSubmit={handleSubmit} className="text-right">
            <Form.Group id="email">
              <Form.Label>דואר אלקטרוני</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group id="name">
              <Form.Label>שם מלא</Form.Label>
              <Form.Control type="name" ref={nameRef} required />
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>סיסמא</Form.Label>
              <Form.Control type="password" ref={passwordRef} required />
            </Form.Group>
            <Form.Group id="password-confirm">
              <Form.Label>אימות סיסמא</Form.Label>
              <Form.Control type="password" ref={passwordConfRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100 " type="submit">
              Sign Up
            </Button>
          </Form>
          {error && (
            <Alert className=" mt-3 mb-0 text-center" variant="danger">
              {error}
            </Alert>
          )}
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        יש לך כבר חשבון? <Link to="/login">כניסה למשתמש קיים</Link>
      </div>
    </>
  );
}
