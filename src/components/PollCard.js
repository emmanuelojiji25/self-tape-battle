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
  option1Content,
  option2Content,
  id,
}) => {
  const [voteComplete, setVoteComplete] = useState(false);
  const [hideCard, setHideCard] = useState(false);

  const [selectedOption, setSelectedOption] = useState(0);

  const PollCardRef = useRef(null);
  const [height, setHeight] = useState();

  const handleVote = async (option) => {
    try {
      const docRef = doc(
        db,
        "users",
        "PCMDGkDXwFbwknOWgJGicTR98rh1",
        "polls",
        id
      );

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
        setHideCard(true);
      }, 100);

      console.log("successfully updated!");
    } catch (error) {
      console.log("couldn't update votes, sorry!");
    }
  };

  useEffect(() => {
    setHeight(PollCardRef.current.offsetHeight);
  }, []);

  return (
    <div
      className={`PollCard ${voteComplete && "fade-out"} ${
        hideCard && "collapse"
      }`}
      ref={PollCardRef}
      style={{ height: `${height}px` }}
    >
      <div className="poll-card-header">
        <h4>{name}</h4>
        <span>2 mins ago</span>
      </div>
      <h3>{question}</h3>
      <h4>#fashion</h4>

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
