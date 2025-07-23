import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./EntryCard.scss";

const EntryCard = ({ url, uid, battleId }) => {
  const { loggedInUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [votes, setVotes] = useState([]);

  const docRef = doc(db, "users", uid);

  const getName = async () => {
    const docSnapshot = await getDoc(docRef);
    const data = docSnapshot.data();
    setName(data.firstName + data.lastName);
  };

  useEffect(() => {
    getName();
    getVotes();
  });

  const getVotes = async () => {
    const docRef = doc(db, "battles", battleId, "entries", uid);
    try {
      const snapshot = await getDoc(docRef);
      setVotes(snapshot.data().votes.length);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async () => {
    const entryRef = doc(db, "battles", battleId, "entries", uid);
    await updateDoc(entryRef, {
      votes: arrayUnion(`${loggedInUser.uid}`),
    });
    onSnapshot(entryRef, async (snapshot) => {
      setVotes(snapshot.data().votes.length);
    });

    //Update Coins
    const userSnapshot = await getDoc(docRef);
    await updateDoc(docRef, {
      coins: userSnapshot.data().coins + 1,
    });
  };

  return (
    <div className="EntryCard">
      <h1>Entry card</h1>
      <span>{name}</span>
      <video src={url} />
      <span>Votes {votes}</span>
      <buton onClick={() => handleVote()}>Vote</buton>
    </div>
  );
};

export default EntryCard;
