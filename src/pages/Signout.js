import { FBAuthContext } from "../contexts/FBAuthContext";
import { useContext, useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

export function Signout(props) {
  const FBAuth = useContext(FBAuthContext);
  const Navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const signOutAlert = () => {
    if (showAlert) {
      return <Alert variant="success">You are signed out</Alert>;
    } else {
      return null;
    }
  };

  const SignOutHandler = () => {
    signOut(FBAuth)
      .then(() => {
        setShowAlert(true);
        setTimeout(() => {
          Navigate("/");
        }, 1500);
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  useEffect(() => SignOutHandler());

  return (
    <div>
      <h1>Sign out</h1>
      {signOutAlert()}
    </div>
  );
}
