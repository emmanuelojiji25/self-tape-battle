import Button from "./Button";
import "./MessageModal.scss";
import coin from "../media/stb_coin.svg";
import gif from "../media/gif.gif";
import ConfettiExplosion from "react-confetti-explosion";
import Confetti from "react-confetti-boom";
import { useEffect, useState } from "react";

const MessageModal = ({ onClick, title, text, buttonText, icon, confetti }) => {
  const [isConfettiExploding, setIsConfettiExploding] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsConfettiExploding(true);
    }, 5000);
  });

  return (
    <div className="message-modal"> 
      {icon}
      <h2>{title}</h2>
      <p>{text}</p>
      <Button filled_color text={buttonText} onClick={onClick} />

      <div className="confetti-container">{confetti && <Confetti />}</div>
    </div>
  );
};

export default MessageModal;
