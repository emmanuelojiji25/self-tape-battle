import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import CreatePoll from "../components/CreatePoll";
import BattleCard from "../components/BattleCard";
import { db } from "../firebaseConfig";
import "./Feed.scss";

const Feed = ({ user }) => {
  const [battles, setBattles] = useState([]);

  const [mostPopular, setMostPopular] = useState([]);

  const handleGetBattles = async () => {
    const battles = [];
    try {
      const querySnapshot = await getDocs(collection(db, "battles"));

      querySnapshot.forEach((doc) => {
        battles.push(doc.data());
      });

      setBattles(battles);

      //Get Most popular
      const entriesArray = [];

      querySnapshot.forEach(async (battle) => {
        const entries = await getDocs(
          collection(db, "battles", battle.id, "entries")
        );
        entriesArray.push(entries);

        const sorted = entriesArray?.sort((a, b) => b.size - a.size)[0];

        const mostPopular = sorted.query._path.segments[1];

        console.log(mostPopular);

        const mostPopularRef = doc(db, "battles", mostPopular);

        const mostPopularSnapshot = await getDoc(mostPopularRef);

        setMostPopular(mostPopularSnapshot.data());
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetBattles();
  }, []);

  return (
    <div className="Feed screen-width">
      <BattleCard name={mostPopular.title} battleId={mostPopular.id} mostPopular={true} />
      {battles.map((battle) => (
        <BattleCard name={battle.title} battleId={battle.id} />
      ))}
    </div>
  );
};

export default Feed;
