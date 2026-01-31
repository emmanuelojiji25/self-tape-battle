import { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./BattleCard.scss";
import Button from "./Button";
import { AuthContext } from "../contexts/AuthContext";
import { Coin, Chest } from "./Icon";

const BattleCard = ({
  name,
  prize,
  battleId,
  mostPopular,
  scheduled,
  status,
}) => {
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
          <Chest width="30" />
        )}
        <h5>{prize}</h5>
      </div>
      {!scheduled && (
        <Link to={`/arena/${battleId}`}>
          <Button
            text={
              status === "closed" || authRole === "professional"
                ? "View battle"
                : "Join battle"
            }
            filled_color
          />
        </Link>
      )}
    </div>
  );
};

export default BattleCard;
