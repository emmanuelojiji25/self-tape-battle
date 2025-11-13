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

  const [storyVisible, setStoryVisible] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(true);

  const { loggedInUser } = useContext(AuthContext);

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
    handleGetLoginStatus();
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

  const userRef = doc(db, "users", loggedInUser.uid);

  const handleGetLoginStatus = async () => {
    try {
      const userSnapshot = await getDoc(userRef);
      setIsStoryComplete(userSnapshot.data().isStoryComplete);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserLoginStatus = async () => {
    await updateDoc(userRef, {
      isStoryComplete: true,
    });
  };

  return (
    <>
      {storyVisible && (
        <Story
          onClick={() => {
            updateUserLoginStatus();
            setStoryVisible(false);
          }}
        />
      )}
      <Header />
      <div className="Feed screen-width">
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

        {!isStoryComplete && (
          <div className="scroll" onClick={() => setStoryVisible(true)}>
            SCROLL
          </div>
        )}
        <NavBar />
      </div>
    </>
  );
};

export default Feed;
