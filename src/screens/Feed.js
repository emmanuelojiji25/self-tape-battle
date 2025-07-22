import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import CreatePoll from "../components/CreatePoll";
import PollCard from "../components/PollCard";
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
      <h1>Battles</h1>
      {battles.map((question) => (
        <PollCard
         
        />
      ))}

 
    </div>
  );
};

export default Feed;
