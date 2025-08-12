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

        setTimeout(() => {
          setLoading(false);
        }, 500);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetBattles();
  }, []);

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
            <BattleCard
              name={mostPopular.title}
              prize={mostPopular.prize}
              battleId={mostPopular.id}
              mostPopular={true}
            />
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
