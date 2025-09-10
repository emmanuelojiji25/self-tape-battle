import "./VerifyEmail.scss";
import { AuthContext } from "../contexts/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export const VerifyEmail = () => {
  const { isEmailVerified } = useContext(AuthContext);

  const { loggedInUser } = useContext(AuthContext);

  if (!loggedInUser) {
    return <Navigate to="/userAuth" replace />;
  }

  return (
    <div className="VerifyEmail">
      <h2>Verify your email</h2>
      <p>{isEmailVerified ? "Yayy" : "Not verified"}</p>
      <p>Please verify the email sent to EMAIL</p>
    </div>
  );
};

export default VerifyEmail;
