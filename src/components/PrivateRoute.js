import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import Loader from "./Loader";

const PrivateRoute = ({ children }) => {
  const { loggedInUser, loading, isEmailVerified, isOnboardingComplete } =
    useContext(AuthContext);

  if (loading) {
    return <Loader />;
  }

  if (!loggedInUser) {
    return <Navigate to="/userAuth" />;
  }

  if (isOnboardingComplete === false) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default PrivateRoute;
