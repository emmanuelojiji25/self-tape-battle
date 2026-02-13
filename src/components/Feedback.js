import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Comment from "./Comment";
import BackButton from "./BackButton";
import "./Feedback.scss";

const Feedback = ({ close, battleId, uid }) => {
  const { loggedInUser } = useContext(AuthContext);

  const [comment, setComment] = useState("");

  const [commentPosted, setCommentPosted] = useState(false);

  const [feedback, setFeedback] = useState([]);

  const [user, setUser] = useState({});

  const [battle, setBattle] = useState({});

  useEffect(() => {
    const getEntry = async () => {
      const userRef = doc(db, "users", uid);

      const userSnapshot = await getDoc(userRef);

      setUser(userSnapshot.data());

      const battleRef = doc(db, "battles", battleId);

      const battleSnapshot = await getDoc(battleRef);

      setBattle(battleSnapshot.data());
    };
    getEntry();
  });

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

        const q = query(collectionRef, orderBy("date", "desc"));

        onSnapshot(q, (snapshot) => {
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
        <BackButton onClick={close} />

        <div className="user-info">
          <div
            className="headshot"
            style={{ backgroundImage: `url(${user.headshot})` }}
          ></div>
          <div>
            <h4>{`${user.firstName} ${user.lastName}`}</h4>
            <p>{battle.title}</p>
          </div>
        </div>
        {uid != loggedInUser.uid && <div className="create-post-container">
          <textarea
            placeholder="Enter your feedback"
            onChange={(e) => {
              setComment(e.target.value);
              setCommentPosted(false);
            }}
            value={comment}
          ></textarea>
          <div className="button-container">
            <Button filled_color text="post" onClick={postComment} />
            {commentPosted && (
              <p className="post-confirmation">Feedback posted</p>
            )}
          </div>
        </div>}

        <div className="feedback-container">
          <h3>{uid === loggedInUser.uid && "Your"} feedback</h3>
          {feedback.map((feedback) => (
            <Comment comment={feedback.comment} uid={feedback.uid} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
