import { Link } from "react-router-dom";
import "./LockedProfile.scss";

const LockedProfile = ({ firstName }) => {
  return (
    <div className="LockedProfile">
      <h1>{firstName}'s profile is private.</h1>
      <span>
        <Link to="/userAuth">Sign In</Link> or{" "}
        <Link to="/userAuth">Sign Up</Link> to view
      </span>
    </div>
  );
};

export default LockedProfile;
