import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";
import "./SubmitFeedback.scss";

const SubmitFeedback = () => {
  const [feedback, setFeedback] = useState();

  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = async () => {
    const feedbackRef = collection(db, "feedback");
    try {
      await addDoc(feedbackRef, {
        feedback: feedback,
      });
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="SubmitFeedback">
      <h2>Submit feedback</h2>
      {submitted ? (
        <p>Thank you for your feedback!</p>
      ) : (
        <>
          <p>
            It would be great if you could help give us feedback to allow us
            improve your experience.
          </p>

          <textarea
            onChange={(e) => {
              setFeedback(e.target.value);
              console.log(feedback);
            }}
          />
          <Button text="Submit" filled_color onClick={() => submitFeedback()} />
        </>
      )}
    </div>
  );
};

export default SubmitFeedback;
