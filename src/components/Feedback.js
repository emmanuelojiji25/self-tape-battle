import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Comment from "./Comment";
import "./Feedback.scss";

const Feedback = ({ close, battleId, uid }) => {
  const { loggedInUser } = useContext(AuthContext);

  const [comment, setComment] = useState("");

  const [commentPosted, setCommentPosted] = useState(false);

  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const getFeedback = () => {
      try {
        const collectionRef = collection(
          db,
          "battles",
          battleId,
          "entries",
          uid,
          "comments"
        );

        onSnapshot(collectionRef, (snapshot) => {
          const data = snapshot.docs.map((doc) => doc.data());
          if (data) {
            setFeedback(data);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };

    getFeedback();
  }, []);

  const postComment = async () => {
    try {
      const docRef = collection(
        db,
        "battles",
        battleId,
        "entries",
        uid,
        "comments"
      );

      await addDoc(docRef, {
        uid: loggedInUser.uid,
        date: Date.now(),
        comment: comment,
      });

      setCommentPosted(true);
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="Feedback">
      <div className="screen-width">
        <h3 onClick={close}>Close</h3>

        <h2>Actor name</h2>
        <textarea
          onChange={(e) => {
            setComment(e.target.value);
            setCommentPosted(false);
          }}
          value={comment}
        ></textarea>
        <div className="button-container">
          <Button filled_color text="post" onClick={postComment} />
          {commentPosted && <p>Feedback posted</p>}
        </div>

        <div className="feedback-container">
          {feedback.map((feedback) => (
            <Comment comment={feedback.comment} uid={feedback.uid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
