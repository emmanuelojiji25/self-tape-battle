import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import "./BattleCard.scss";
import gift from "../media/gift.svg";
import fire from "../media/fire.svg";
import Button from "./Button";

const BattleCard = ({ name, prize, battleId, mostPopular }) => {
  const [voteComplete, setVoteComplete] = useState(false);
  const [collapseCard, setCollapseCard] = useState(false);
  const [removeCard, setRemoveCard] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const PollCardRef = useRef(null);
  const [height, setHeight] = useState();

  const [username, setUsername] = useState();

  return (
    <div className={`PollCard ${mostPopular && "most-popular"}`}>
      {mostPopular && (
        <span className="most-popular-label">
          <div className="image-container">
            <div className="dot-1 dot"></div>
            <div className="dot-2 dot"></div>
            <div className="dot-3 dot"></div>
            <img src={fire} />
          </div>
          Most Popular
        </span>
      )}
      <span className="title">{name}</span>
      <span className="prize">
        <img src={gift} />
        {prize}
      </span>
      <Link to={`/arena/${battleId}`}>
        <Button text="Join" filled />
      </Link>
    </div>
  );
};

export default BattleCard;
