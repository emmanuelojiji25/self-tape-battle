import { Link } from "react-router-dom";
import Button from "./Button";
import "./ActorCard.scss";

const ActorCard = ({ name, bio, headshot, username }) => {
  return (
    <div className="ActorCard">
      <div
        className="actor-card-headshot"
        style={{ backgroundImage: `url(${headshot})` }}
      ></div>
      <div>
        <Link to={`/profile/${username}`}>{name}</Link>
        <Button filled text="View Profile"></Button>
      </div>
    </div>
  );
};

export default ActorCard;
