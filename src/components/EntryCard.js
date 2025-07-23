import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import "./EntryCard.scss";

const EntryCard = ({ url, uid, battleId }) => {
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
      console.log(db);
      const snapshot = await getDoc(docRef);
      setVotes(snapshot.data().votes.length);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async () => {
    const docSnapshot = await getDoc(docRef);
    const data = docSnapshot.data();
    setVotes(data.votes);
  };

  return (
    <div className="EntryCard">
      <h1>Entry card</h1>
      <span>{name}</span>
      <video src={url} />
      <span>Votes {votes}</span>
      <buton>Vote</buton>
    </div>
  );
};

export default EntryCard;
