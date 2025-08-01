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
import Button from "../components/Button";

const Profile = () => {
  const params = useParams();

  const { loggedInUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  const [battles, setBattles] = useState([]);

  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [headshot, setHeadshot] = useState("");

  const [battlesWon, setBattlesWon] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  const getUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", `${params.username}`));
      const userDoc = await getDocs(q);

      userDoc.forEach((doc) => {
        const data = doc.data();
        setUsername(data.username);
        setUserId(data.uid);
        setName(`${data.firstName + " " + data.lastName}`);
        setBio(data.bio);
        setLink(data.webLink);
        setHeadshot(data.headshot);
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

      let data = [];

      docs.forEach((doc) => {
        data.push(doc.data());
      });
      setBattles(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBattlesWon = async () => {
    try {
      const collectionRef = collection(db, "battles");
      const q = query(collectionRef, where("winner", "==", userId));
      const docs = await getDocs(q);

      setBattlesWon(docs.size);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalVotes = async () => {
    try {
      const collectionRef = collectionGroup(db, "entries");
      const q = query(
        collectionRef,
        where("uid", "==", "3sfGK3I6anY1trjMnan8lbGdGag1")
      );

      const docs = await getDocs(q);

      const votes = [];

      docs.forEach((doc) => {
        votes.push(doc.data().votes.length);
      });

      const calculation = votes.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

      setTotalVotes(calculation);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [params.username]);

  useEffect(() => {
    getUserBattles();
    getBattlesWon();
    getTotalVotes();
  }, [userId]);

  const handleCopyProfile = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/profile/${params.username}`
      );
      console.log(navigator.clipboard.readText());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Profile screen-width">
      <div className="profile-header">
        <div className="profile-headshot-container">
          <img className="profile-headshot" src={headshot} />
        </div>
        <div className="profile-info">
          <h1>{name}</h1>
          <span>{bio}</span>
          <a href={link} target="_" className="web-link">
            {link}
          </a>
          <Button
            filled
            text="Share Card"
            onClick={() => handleCopyProfile()}
          ></Button>
          {userId === loggedInUser?.uid && (
            <Button
              outline
              text="Edit Profile"
              onClick={() => handleCopyProfile()}
            ></Button>
          )}
        </div>
      </div>

      <div className="stat-card-container">
        <div className="stat-card">
          <h2>{battles.length}</h2>
          <h4>Battles Entered</h4>
        </div>
        <div className="stat-card">
          <h2>{battlesWon}</h2>
          <h4>Battles Won</h4>
        </div>
        <div className="stat-card">
          <h2>{totalVotes}</h2>
          <h4>Total votes</h4>
        </div>
      </div>

      <div className="entries-container">
        {battles.map((battle) => (
          <>
            {
              <EntryCard
                url={battle.url}
                uid={battle.uid}
                battleId={battle.battleId}
              />
            }
          </>
        ))}
      </div>
    </div>
  );
};

export default Profile;
