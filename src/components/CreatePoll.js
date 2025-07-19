import { useState } from "react";
import "./CreatePoll.scss";

const CreatePoll = () => {
  const [type, setType] = useState("text");
  return (
    <div className="CreatePoll">
      <input type="text" placeholder="write question.." />
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
            ></input>
            <input
              type="text"
              className="bar-input"
              placeholder="Option 2"
            ></input>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePoll;
