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
    const getReadByUsers = async () => {
      try {
        const updateRef = doc(db, "updates", "new-vote-mechanism");

        onSnapshot(updateRef, (snapshot) => {
          setReadByUser(snapshot.data().readBy?.includes(loggedInUser.uid))
        })

      } catch (error) {
        console.log(error)
      }

    }

    getReadByUsers();

  })


  const handleReadUpdate = async () => {
    try {
      const updatesCollection = doc(db, "updates", "new-vote-mechanism")
      await setDoc(updatesCollection, {
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

            <h4>Vote-to-enter update</h4>
            <p>The mandatory vote-to-enter if there are more than 5 entries, is now changed to 10. This is to allow a wider selection to vote for.  </p>

            <h4>5 coins for winning entry vote</h4>
            <p>Instead of 1 extra coin, you now get 5 coins for voting for the winning entry!</p>


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
