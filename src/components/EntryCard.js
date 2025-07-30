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
import ConfettiExplosion from "react-confetti-explosion";
import { Link } from "react-router-dom";

const EntryCard = ({ url, uid, battleId, voteButtonVisible }) => {
  const { loggedInUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [votes, setVotes] = useState([]);
  const [userhasVoted, setUserHasVoted] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const [username, setUsername] = useState("");

  const [entryUid, setEntryUid] = useState("");
  const [isUserEntry, setIsUserEntry] = useState(false);
  const [battleStatus, setBattleStatus] = useState("open");

  const docRef = doc(db, "users", uid);

  const getName = async () => {
    const docSnapshot = await getDoc(docRef);
    const data = docSnapshot.data();
    setName(data?.firstName + " " + data?.lastName);
    setUsername(data?.username);
    setEntryUid(data.uid);
  };

  useEffect(() => {
    getName();
    getVotes();
    console.log(loggedInUser);
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
      setIsExploding(true);
    } else return null;
  };

  return (
    <div className="EntryCard">
      {isExploding && <ConfettiExplosion />}
      <Link to={`/profile/${username}`} className="name">
        {name}
      </Link>
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
          {(uid === loggedInUser.uid || battleStatus === "closed") && (
            <span className="votes">
              {votes > 0 ? votes : "No"} Vote {votes > 0 && votes !== 1 && "s"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
