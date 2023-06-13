import { FBAuthContext } from "../contexts/FBAuthContext";
import { useContext, useEffect } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export function Signout(props) {
  const FBAuth = useContext(FBAuthContext);
  const Navigate = useNavigate();

  const SignOutHandler = () => {
    signOut(FBAuth)
      .then(() => {
        Navigate("/");
        //do sign out procedure
      })
      .catch((error) => {
        console.log(error.code, error.message);
      });
  };

  useEffect(() => SignOutHandler());

  return (
    <div>
      <h1>Sign out</h1>
    </div>
  );
}
