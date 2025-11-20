import Button from "./Button";
import "./MessageModal.scss";
import coin from "../media/stb_coin.svg";
import gif from "../media/gif.gif";

const MessageModal = ({ onClick, title, text, buttonText, icon }) => {
  return (
    <div className="message-modal">
      <img src={icon} />
      <h2>{title}</h2>
      <p>{text}</p>
      <Button filled text={buttonText} onClick={onClick} />
    </div>
  );
};

export default MessageModal;
