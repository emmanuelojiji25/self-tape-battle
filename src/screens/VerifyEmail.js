import "./VerifyEmail.scss";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export const VerifyEmail = () => {
  const { loggedInUser, isEmailVerified, setIsEmailVerified } =
    useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) return;

    const interval = setInterval(async () => {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        setIsEmailVerified(true);
        navigate("/onboarding");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loggedInUser, navigate, setIsEmailVerified]);

  if (!loggedInUser) {
    return <Navigate to="/userAuth" replace />;
  }

  const signOut = async () => {
    try {
      auth.signOut();
    } catch (error) {
      console.log("Couldn't sign out sorry");
    }
  };

  return (
    <div className="VerifyEmail">
      <h2>Verify your email</h2>
      <p>{isEmailVerified ? "Yayy" : "Not verified"}</p>
      <p>Please verify the email sent to EMAIL</p>

      <button
        onClick={async () => {
          try {
            await sendEmailVerification(auth.currentUser);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Resend link
      </button>
      <button onClick={() => signOut()}>sign out</button>
    </div>
  );
};

export default VerifyEmail;
