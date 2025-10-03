import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { loggedInUser, loading, isEmailVerified, isOnboardingComplete } =
    useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loggedInUser) {
    return <Navigate to="/userAuth" />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/emailverification" />;
  }

  /*if (!isOnboardingComplete) {
    return <Navigate to="/onboarding" />;
  } Fix this later. onboarding issue*/ 

  return children;
};

export default PrivateRoute;
