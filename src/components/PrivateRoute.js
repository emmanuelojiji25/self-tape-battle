import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { loggedInUser, loading, isEmailVerified } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!loggedInUser) {
    return <Navigate to="/userAuth" />;
  }

  if (!isEmailVerified) {
    return <Navigate to="/emailverification" />;
  }

  return children;
};

export default PrivateRoute;
