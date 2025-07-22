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

const BattleCard = ({ name, battleId }) => {
  const [voteComplete, setVoteComplete] = useState(false);
  const [collapseCard, setCollapseCard] = useState(false);
  const [removeCard, setRemoveCard] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const PollCardRef = useRef(null);
  const [height, setHeight] = useState();

  const [username, setUsername] = useState();

  return (
    <div className="PollCard">
      <span className="title">{name}</span>
      <Link to={`/arena/${battleId}`}>
        <button>Join Battle</button>
      </Link>
    </div>
  );
};

export default BattleCard;
