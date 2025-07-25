import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { auth, db } from "../firebaseConfig";
import "./EntryCard.scss";

const EntryCard = ({ url, uid, battleId, voteButtonVisible }) => {
  const { loggedInUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [votes, setVotes] = useState([]);
  const [userhasVoted, setUserHasVoted] = useState(false);

  const docRef = doc(db, "users", uid);

  const getName = async () => {
    const docSnapshot = await getDoc(docRef);
    const data = docSnapshot.data();
    setName(data?.firstName + " " + data?.lastName);
  };

  useEffect(() => {
    getName();
    getVotes();
  });

  useEffect(() => {}, loggedInUser);

  const getVotes = async () => {
    const docRef = doc(db, "battles", battleId, "entries", uid);
    try {
      const snapshot = await getDoc(docRef);
      setVotes(snapshot.data().votes.length);

      const votesCheck = snapshot.data().votes;

      setUserHasVoted(votesCheck.includes(loggedInUser.uid));

      console.log(userhasVoted);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async () => {
    if (!userhasVoted) {
      const entryRef = doc(db, "battles", battleId, "entries", uid);
      await updateDoc(entryRef, {
        votes: arrayUnion(`${loggedInUser.uid}`),
      });
      onSnapshot(entryRef, async (snapshot) => {
        setVotes(snapshot.data().votes.length);
      });

      //Update Coins
      const authUserSnapshot = await getDoc(doc(db, "users", loggedInUser.uid));
      const authUserRef = doc(db, "users", loggedInUser.uid);
      await updateDoc(authUserRef, {
        coins: authUserSnapshot.data().coins + 1,
      });
    } else return null;
  };

  return (
    <div className="EntryCard">
      <span className="name">{name}</span>
      <div className="video-container">
        <video src={url} />
        <div className="user-actions">
          {voteButtonVisible && (
            <button
              onClick={() => handleVote()}
              className={`vote-button ${userhasVoted && "voted"}`}
            >
              {!userhasVoted ? "Vote" : "Voted"}
            </button>
          )}
          <span className="votes">
            {votes > 0 ? votes : "No"} Vote {votes > 0 && votes !== 1 && "s"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
