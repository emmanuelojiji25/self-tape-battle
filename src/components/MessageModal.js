import Button from "./Button";
import "./MessageModal.scss";
import gif from "../media/gif.gif";

const MessageModal = ({ onClick, title, text, buttonText }) => {
  return (
    <div className="message-modal">
      <img src={gif} />
      <h2>{title}</h2>
      <p>{text}</p>
      <Button filled text={buttonText} onClick={onClick} />
    </div>
  );
};

export default MessageModal;
