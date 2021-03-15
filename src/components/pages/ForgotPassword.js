import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ForgotPassword() {
  const emailRef = useRef();

  const { resetPassword, currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [msg, setMsg] = useState();
  const history = useHistory();

  useEffect(() => {
    if (currentUser) {
      history.push("/");
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setMsg("");
      setLoading(true);

      await resetPassword(emailRef.current.value);

      setMsg("בדוק את תיבת הדואר האלקטרוני למשך תהליך איפוס");
    } catch (e) {
      setError(`${e?.message} `);
    } finally {
      setLoading(false);
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
          <h2>איפוס סיסמה</h2>
          <Form onSubmit={handleSubmit} className="text-right">
            <Form.Group id="email">
              <Form.Label>דואר אלקטרוני</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>

            <Button disabled={loading} className="w-100 " type="submit">
              איפוס סיסמה
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            <Link to="login">כניסה למשתמש קיים</Link>
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        אין לך חשבון? <Link to="/signup">צור חשבון חדש</Link>
      </div>
    </>
  );
}
