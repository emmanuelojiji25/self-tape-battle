import "./VerifyEmail.scss";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Loader from "../components/Loader";
import Button from "../components/Button";

export const VerifyEmail = () => {
  const { loggedInUser, isEmailVerified, setIsEmailVerified, loading } =
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

    console.log(auth.currentUser);

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
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2>You're almost in!</h2>
          <p>Please verify the email sent to {loggedInUser.email}</p>

          <Button
            text="Resend email"
            onClick={async () => {
              try {
                await sendEmailVerification(auth.currentUser);
                console.log("sent!")
              } catch (error) {
                console.log(error);
              }
            }}
            filled
          />

          <Button
            onClick={() => {
              signOut();
              navigate("/userAuth");
            }}
            text="Sign out"
            outline
          />
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
