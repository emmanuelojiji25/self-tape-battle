import {
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebaseConfig";
import "./PollCard.scss";

const PollCard = ({
  type,
  name,
  question,
  category,
  option1Content,
  option2Content,
  id,
  userId,
}) => {
  const [voteComplete, setVoteComplete] = useState(false);
  const [collapseCard, setCollapseCard] = useState(false);
  const [removeCard, setRemoveCard] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const PollCardRef = useRef(null);
  const [height, setHeight] = useState();

  const [username, setUsername] = useState();

  const handleVote = async (option) => {
    try {
      const docRef = doc(db, "polls", id);

      const docSnapshot = await getDoc(docRef);

      const numOfVotes = docSnapshot.data()[option].votes;

      await updateDoc(docRef, {
        [option]: {
          votes: numOfVotes + 1,
          option: docSnapshot.data()[option].option,
        },
      });

      setVoteComplete(true);

      setTimeout(() => {
        setCollapseCard(true);
      }, 300);

      setTimeout(() => {
        setRemoveCard(true);
      }, 600);

      console.log("successfully updated!");
    } catch (error) {
      console.log("couldn't update votes, sorry!");
    }
  };

  const getUsername = async () => {
    try {
      const docRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(docRef);
      setUsername(docSnapshot.data().username);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setHeight(PollCardRef.current.offsetHeight);
    getUsername();
  }, []);

  return (
    <div
      className={`PollCard ${voteComplete && "fade-out"} ${
        collapseCard && "collapse"
      } ${removeCard && "remove-card"}`}
      ref={PollCardRef}
      style={{ height: `${height}px` }}
    >
      <div className="poll-card-header">
        <span className="name">{username}</span>
        <span className="time">2 mins ago</span>
      </div>
      <span className="question">{question}</span>
      <h4 className="category">#{category}</h4>

      {type === "text" && (
        <div className="poll-bar-container">
          <div
            className="poll-bar"
            onClick={() => {
              handleVote("option1");
            }}
          >
            {option1Content}
          </div>
          <div
            className="poll-bar"
            onClick={() => {
              handleVote("option2");
            }}
          >
            {option2Content}
          </div>
        </div>
      )}

      {type === "image" && (
        <div className="poll-image-container">
          <div className="image-container">
            <img
              src={option1Content}
              onClick={() => {
                handleVote("option1");
              }}
            />
          </div>
          <div className="image-container">
            <img
              src={option2Content}
              onClick={() => {
                handleVote("option2");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PollCard;
