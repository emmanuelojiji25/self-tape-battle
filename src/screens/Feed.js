import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import BattleCard from "../components/BattleCard";
import { db } from "../firebaseConfig";
import "./Feed.scss";
import Header from "../components/Header";
import logo from "../media/logo-icon.svg";
import NavBar from "../components/NavBar";
import Wallet from "../components/Wallet";
import Story from "../components/Story";

import { AuthContext } from "../contexts/AuthContext";

const Feed = ({ user }) => {
  const [battles, setBattles] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedBattles = localStorage.getItem("battles");

    if (cachedBattles) {
      try {
        setBattles(JSON.parse(cachedBattles));

        setLoading(false);
      } catch (err) {
        console.warn("Failed to parse cached data, refetching...", err);
        handleGetBattles();
      }
    } else {
      handleGetBattles();
    }
  }, []);

  const handleGetBattles = async () => {
    const battles = [];
    try {
      const querySnapshot = await getDocs(collection(db, "battles"));

      if (querySnapshot.empty) {
        setLoading(false);
      }

      querySnapshot.forEach((doc) => {
        battles.push(doc.data());
      });

      setBattles(battles);

      localStorage.setItem("battles", JSON.stringify(battles));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
       <div className="overlay"></div>
      <Header />
   
      <div className="Feed screen-width">
        <>
        <h1>Battles</h1>
          {battles.map((battle) => (
            <BattleCard
              name={battle.title}
              prize={battle.prize.value}
              battleId={battle.id}
            />
          ))}
        </>

        <NavBar />
      </div>
    </>
  );
};

export default Feed;
