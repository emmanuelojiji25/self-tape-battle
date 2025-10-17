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

      //Get Most popular
      const entriesArray = [];

      querySnapshot.forEach(async (battle) => {
        const entries = await getDocs(
          collection(db, "battles", battle.id, "entries")
        );
        entriesArray.push(entries);

        const sorted = entriesArray?.sort((a, b) => b.size - a.size)[0];

        const mostPopular = sorted.query._path.segments[1];

        const mostPopularRef = doc(db, "battles", mostPopular);

        const mostPopularSnapshot = await getDoc(mostPopularRef);

        setMostPopular(mostPopularSnapshot.data());

        localStorage.setItem(
          "mostPopular",
          JSON.stringify(mostPopularSnapshot.data())
        );

        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
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
            {battles.length > 0 && (
              <BattleCard
                name={mostPopular.title}
                prize={mostPopular.prize}
                battleId={mostPopular.id}
                mostPopular={true}
              />
            )}
            {battles
              .filter((battle) => battle.id != mostPopular.id)
              .map((battle) => (
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
