import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { signInWithEmailAndPassword } from "firebase/auth";
import { FBAuthContext } from "../contexts/FBAuthContext";

export function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const FBAuth = useContext(FBAuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (email.indexOf("@") > 0) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }, [email]);

  useEffect(() => {
    if (password.length >= 8) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  }, [password]);

  const SignInHandler = () => {
    signInWithEmailAndPassword(FBAuth, email, password)
      .then((user) => {
        //take user to homepage after loggin in
        navigate("/");
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          <Form
            onSubmit={(evt) => {
              evt.preventDefault();
              SignInHandler();
            }}
          >
            <h3>Sign in to your account</h3>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="my-2 w-100"
              size="lg"
              disabled={validEmail && validPassword ? false : true}
            >
              Sign In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
