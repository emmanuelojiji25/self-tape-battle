import "./Profile.scss";

import {
  arrayRemove,
  arrayUnion,
  collection,
  collectionGroup,
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
import EntryCard from "../components/EntryCard";

const Profile = () => {
  const params = useParams();

  const { loggedInUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const [battles, setBattles] = useState([]);

  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");

  const getUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", `${params.username}`));
      const userDoc = await getDocs(q);

      userDoc.forEach((doc) => {
        const data = doc.data();
        setUsername(data.username);
        setUserId(data.uid);
        setBio(data.bio);
        setLink(data.link);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserBattles = async () => {
    try {
      const battlesCollection = collectionGroup(db, "entries");
      const q = query(battlesCollection, where("uid", "==", userId));
      const docs = await getDocs(q);

      console.log(docs.empty);

      let data = [];

      docs.forEach((doc) => {
        data.push(doc.data());
      });
      setBattles(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [params.username]);

  useEffect(() => {
    getUserBattles();
  }, [userId]);

  return (
    <div className="Profile screen-width">
      <h1>{username}</h1>
      <span>{bio}</span>
      <span>{link}</span>

      {battles.map((battle) => (
        <>
          <EntryCard
            url={battle.url}
            uid={battle.uid}
            battleId={battle.battleId}
            
          />
        </>
      ))}
    </div>
  );
};

export default Profile;
