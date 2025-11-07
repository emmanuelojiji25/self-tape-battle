import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import BattleCard from "../components/BattleCard";
import { db } from "../firebaseConfig";
import "./Feed.scss";
import Header from "../components/Header";
import logo from "../media/logo-icon.svg";
import NavBar from "../components/NavBar";
import Wallet from "../components/Wallet";

const Feed = ({ user }) => {
  const [battles, setBattles] = useState([]);

  const [mostPopular, setMostPopular] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cachedBattles = localStorage.getItem("battles");
    const cachedMostPopular = localStorage.getItem("mostPopular");

    if (cachedBattles && cachedMostPopular) {
      try {
        setBattles(JSON.parse(cachedBattles));
        setMostPopular(JSON.parse(cachedMostPopular));
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
      <Header />
      <div className="Feed screen-width">
        {loading ? (
          <div className="feed-loader-container">
            <img src={logo} className="loader" />
          </div>
        ) : (
          <>
            {battles.length === 0 && (
              <h1 style={{ color: "white" }}>No battles. Check back soon!</h1>
            )}

            {battles.map((battle) => (
              <BattleCard
                name={battle.title}
                prize={battle.prize}
                battleId={battle.id}
              />
            ))}
          </>
        )}
        <NavBar />
      </div>
    </>
  );
};

export default Feed;
