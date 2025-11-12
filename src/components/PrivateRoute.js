import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import logo from "../media/logo-icon.svg";

const PrivateRoute = ({ children }) => {
  const { loggedInUser, loading, isEmailVerified, isOnboardingComplete } =
    useContext(AuthContext);

  if (loading) {
    return (
      <div className="feed-loader-container">
        <img src={logo} className="loader" />
      </div>
    );
  }

  if (!loggedInUser) {
    return <Navigate to="/userAuth" />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/emailverification" />;
  }

  if (!isOnboardingComplete) {
    return <Navigate to="/onboarding" />;
  }

  return children;
};

export default PrivateRoute;
