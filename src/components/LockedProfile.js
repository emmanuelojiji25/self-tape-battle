import { Link } from "react-router-dom";
import "./LockedProfile.scss";

const LockedProfile = ({ firstName }) => {
  return (
    <div className="LockedProfile">
      <h1>Wait a minute!</h1>
      <p>
        <span className="bold">{firstName}'s</span> profile is private.
      </p>
      <span>
        <Link to="/userAuth">Sign In</Link> or{" "}
        <Link to="/userAuth">Sign Up</Link> to view
      </span>
    </div>
  );
};

export default LockedProfile;
