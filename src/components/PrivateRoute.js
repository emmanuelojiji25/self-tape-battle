import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { loggedInUser, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  return loggedInUser ? children : <Navigate to="/userAuth" replace />;
};

export default PrivateRoute;
