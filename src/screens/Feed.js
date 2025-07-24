import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import CreatePoll from "../components/CreatePoll";
import BattleCard from "../components/BattleCard";
import { db } from "../firebaseConfig";
import "./Feed.scss";

const Feed = ({ user }) => {
  const [battles, setBattles] = useState([]);

  const handleGetBattles = async () => {
    const battles = [];
    try {
      const querySnapshot = await getDocs(collection(db, "battles"));

      querySnapshot.forEach((doc) => {
        battles.push(doc.data());
      });

      setBattles(battles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetBattles();
  }, []);

  return (
    <div className="Feed screen-width">
      {battles.map((battle) => (
        <BattleCard name={battle.title} battleId={battle.id}  />
      ))}
    </div>
  );
};

export default Feed;
