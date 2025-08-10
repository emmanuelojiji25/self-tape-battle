import Button from "./Button";
import "./MessageModal.scss";
import gif from "../media/gif.gif"

const MessageModal = ({onClick}) => {
  return (
    <div className="message-modal">
      <img src={gif} />
      <h2>Let's go!</h2>
      <p>You've entered the battle.</p>
      <Button filled text="View" onClick={onClick}/>
    </div>
  );
};

export default MessageModal;
