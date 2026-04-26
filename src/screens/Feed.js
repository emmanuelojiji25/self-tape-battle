import {
  addDoc,
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
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
import Button from "../components/Button";

const Feed = ({ user }) => {
  const [battles, setBattles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [readByUser, setReadByUser] = useState(true)

  const { loggedInUser } = useContext(AuthContext)

  useEffect(() => {
    const cached = localStorage.getItem("battles");

    if (cached) {
      try {
        setBattles(JSON.parse(cached));
        setLoading(false);
      } catch { }
    }

    const battlesRef = collection(db, "battles");

    const q = query(
      battlesRef,
      where("visibility", "==", "published"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
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

  useEffect(() => {
    if (!loggedInUser?.uid) return;

    const updateRef = doc(db, "updates", "new-voting-schedule");

    const unsubscribe = onSnapshot(updateRef, (snapshot) => {
      const data = snapshot.data();
      setReadByUser(data?.readBy?.includes(loggedInUser.uid) ?? false);
    });

    return () => unsubscribe();
  }, [loggedInUser]);


  const handleReadUpdate = async () => {
    try {
      const updatesCollection = doc(db, "updates", "new-voting-schedule")
      await updateDoc(updatesCollection, {
        readBy: arrayUnion(loggedInUser.uid)
      })
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      {/*<div className="overlay"></div>*/}
      <Header />

      <div className="Feed screen-width">
        <>
          {!readByUser && <div className="updates">
            <h2>Here's what's new..</h2>

<div className="update-section">
            <h4>New voting schedule</h4>
            <p>By popular demand and based on your feedback, we're introducing an Entry Period and Voting period to make the battle process fairer for all actors</p>

            <li>
              Entry period: Sunday - Thursday
            </li>
            <li>
              Voting period: Friday - Sunday
            </li>

            <li>
              Sunday evening: Winners announced + New battle commences
            </li>
            </div>

<div className="update-section">
            <h4>Randomised entry order</h4>
            <p>First entries, first seen ❌</p>
            <p>Entries will now be displayed in a randomised order to ensure everyone has a fair chance at optimal visibility! ✅</p>
</div>



            <Button filled_color text="Got it!" onClick={() => handleReadUpdate()} />
          </div>}
          <h1>Battles</h1>

          {battles.map((battle) => (
            <BattleCard
              name={battle.title}
              prize={battle?.prize?.value}
              battleId={battle.id}
              scheduled={battle.scheduled}
              status={battle.status}
              additional_info={battle.additional_info}
            />
          ))}
        </>

        <NavBar />
      </div>
    </>
  );
};

export default Feed;
