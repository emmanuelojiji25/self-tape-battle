import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import "./CreatePoll.scss";

const CreatePoll = () => {
  const [type, setType] = useState("text");

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [category, setCategory] = useState("unknown");

  const handleCreatePoll = async () => {
    try {
      const docRef = await addDoc(
        collection(db, "users", "PCMDGkDXwFbwknOWgJGicTR98rh1", "polls"),
        {
          type: type,
          question: question,
          id: "",
          option1: {
            option: option1,
            votes: 0,
          },

          option2: {
            option: option2,
            votes: 0,
          },
          category: category,
        }
      );

      await updateDoc(
        doc(db, "users", "PCMDGkDXwFbwknOWgJGicTR98rh1", "polls", docRef.id),
        {
          id: docRef.id,
        }
      );
    } catch (error) {}
  };
  

  return (
    <div className="CreatePoll">
      <input
        type="text"
        placeholder="write question.."
        onChange={(e) => setQuestion(e.target.value)}
      />
      <span onClick={() => setType(type === "image" ? "text" : "image")}>
        Switch to {type === "image" ? "text" : "image"} poll
      </span>

      <div className="poll-type-container">
        {type === "image" && (
          <div className="create-image-poll-container">
            <div className="placeholder-container">
              <div className="placeholder">1</div>
              <div className="placeholder">2</div>
            </div>
          </div>
        )}

        {type === "text" && (
          <div className="create-text-poll-container">
            <input
              type="text"
              className="bar-input"
              placeholder="Option 1"
              onChange={(e) => setOption1(e.target.value)}
            ></input>
            <input
              type="text"
              className="bar-input"
              placeholder="Option 2"
              onChange={(e) => setOption2(e.target.value)}
            ></input>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          handleCreatePoll();
        }}
      >
        Post
      </button>
    </div>
  );
};

export default CreatePoll;
