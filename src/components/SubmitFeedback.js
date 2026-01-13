import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";

const SubmitFeedback = () => {
  const [feedback, setFeedback] = useState();

  const submitFeedback = async () => {
    const feedbackRef = collection(db, "feedback");
    try {
      await addDoc(feedbackRef, {
        feedback: feedback,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="SubmitFeedback">
      <h1>Submit feedback</h1>
      <p>It would be great if you could help give us feedback.</p>

      <textarea
        onChange={(e) => {
          setFeedback(e.target.value);
          console.log(feedback);
        }}
      />
      <Button text="submit" filled onClick={() => submitFeedback()} />
    </div>
  );
};

export default SubmitFeedback;
