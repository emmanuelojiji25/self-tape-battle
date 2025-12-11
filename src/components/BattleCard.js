import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import "./BattleCard.scss";
import chest from "../media/chest.svg";
import fire from "../media/fire.svg";
import coin from "../media/stb_coin.svg";
import Button from "./Button";
import { AuthContext } from "../contexts/AuthContext";

const BattleCard = ({ name, prize, battleId, mostPopular }) => {
  const [voteComplete, setVoteComplete] = useState(false);
  const [collapseCard, setCollapseCard] = useState(false);
  const [removeCard, setRemoveCard] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const PollCardRef = useRef(null);
  const [height, setHeight] = useState();

  const [username, setUsername] = useState();

  const { authRole } = useContext(AuthContext);

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
      <h3 className="title">{name}</h3>
      <div className="prize">
        {typeof prize === "number" ? (
          <img src={coin} className="icon-small" />
        ) : (
          <img src={chest} className="chest" />
        )}
        <h5>{prize}</h5>
      </div>
      <Link to={`/arena/${battleId}`}>
        <Button text={authRole === "actor" ? "Join Battle" : "View"} filled />
      </Link>
    </div>
  );
};

export default BattleCard;
