import "./Profile.scss";

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BattleCard from "../components/BattleCard";
import { db } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";

const Profile = () => {
  const params = useParams();

  const { loggedInUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const [battles, setBattles] = useState([]);

  const getUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", `${params.username}`));
      const userDoc = await getDocs(q);

      userDoc.forEach((doc) => {
        setUsername(doc.data().username);
        setUserId(doc.data().userId);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserBattles = async () => {
    if (!userId) return;
    try {
      const battlesCollection = collection(db, "battles");
      const q = query(battlesCollection, where("userId", "==", userId));
      const docs = await getDocs(q);

      let data = [];

      docs.forEach((doc) => {
        data.push(doc.data());
      });
      setBattles(data);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [params.username]);

  return (
    <div className="Profile">
      <h1>{username}</h1>
      <span>Bio here</span>

      {battles.map((poll) => (
        <BattleCard />
      ))}
    </div>
  );
};

export default Profile;
