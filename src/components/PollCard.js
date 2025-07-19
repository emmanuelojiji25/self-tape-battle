import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./PollCard.scss";

const PollCard = ({
  type,
  name,
  question,
  option1,
  option2,
  image1,
  image2,
}) => {
  return (
    <div className="PollCard">
      <div className="poll-card-header">
        <h4>{name}</h4>
        <span>2 mins ago</span>
      </div>
      <h3>{question}</h3>

      {type === "text" && (
        <div className="poll-bar-container">
          <div className="poll-bar">{option1}</div>
          <div className="poll-bar">{option2}</div>
        </div>
      )}

      {type === "image" && (
        <div className="poll-image-container">
          <img src={option1} />
          <img src={option2} />
        </div>
      )}
    </div>
  );
};

export default PollCard;
