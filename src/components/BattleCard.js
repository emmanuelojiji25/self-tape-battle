import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./BattleCard.scss";
import Button from "./Button";
import { AuthContext } from "../contexts/AuthContext";
import { Coin, Chest } from "./Icon";

const BattleCard = ({ name, prize, battleId, mostPopular, scheduled }) => {
  const [voteComplete, setVoteComplete] = useState(false);
  const [collapseCard, setCollapseCard] = useState(false);
  const [removeCard, setRemoveCard] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const PollCardRef = useRef(null);
  const [height, setHeight] = useState();

  const [username, setUsername] = useState();

  const { authRole } = useContext(AuthContext);

  return (
    <div className={`PollCard`}>
      {!scheduled ? (
        <h3 className="title">{name}</h3>
      ) : (
        <>
          <h3 className="title">Coming soon</h3>
          <p>1st February</p>
        </>
      )}
      <div className="prize">
        {typeof prize === "number" ? (
          <Coin width="25" coin />
        ) : (
          <Chest width="25"/>
        )}
        <h5>{prize}</h5>
      </div>
      {!scheduled && (
        <Link to={`/arena/${battleId}`}>
          <Button
            text={authRole === "actor" ? "Join Test Battle" : "View"}
            filled_color
          />
        </Link>
      )}
    </div>
  );
};

export default BattleCard;
