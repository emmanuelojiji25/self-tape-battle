import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import CreatePoll from "../components/CreatePoll";
import PollCard from "../components/PollCard";
import { db } from "../firebaseConfig";
import "./Feed.scss";

const Feed = () => {
  const [isCreatePollVisible, setIsCreatePollVisible] = useState(false);
  const [questions, setQuestions] = useState([]);

  const handleGetPolls = async () => {
    const polls = [];
    try {
      const querySnapshot = await getDocs(
        collection(db, "users", "PCMDGkDXwFbwknOWgJGicTR98rh1", "polls")
      );

      console.log("success!");

      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        polls.push(doc.data());
      });

      setQuestions(polls);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPolls();
  }, []);

  return (
    <div className="Feed screen-width">


      {questions.map((question) => (
        <PollCard
          type={question.type}
          question={question.question}
          option1Content={question.option1.option}
          option2Content={question.option2.option}
          id={question.id}
        />
      ))}

      <button
        className="create-poll"
        onClick={() => setIsCreatePollVisible(true)}
      >
        Create Poll
      </button>

      {isCreatePollVisible && <CreatePoll />}
    </div>
  );
};

export default Feed;
