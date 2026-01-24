import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
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
    const cached = localStorage.getItem("battles");

    if (cached) {
      try {
        setBattles(JSON.parse(cached));
        setLoading(false);
      } catch {}
    }

    const battlesRef = collection(db, "battles");

    const unsubscribe = onSnapshot(battlesRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBattles((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });

      localStorage.setItem("battles", JSON.stringify(data));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {/*<div className="overlay"></div>*/}
      <Header />

      <div className="Feed screen-width">
        <>
          <h1>Battles</h1>
          {battles.map((battle) => (
            <BattleCard
              name={battle.title}
              prize={battle.prize.value}
              battleId={battle.id}
              scheduled={battle.scheduled}
            />
          ))}
        </>

        <NavBar />
      </div>
    </>
  );
};

export default Feed;
