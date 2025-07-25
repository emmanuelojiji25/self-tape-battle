import "./Button.scss";

const Button = ({ text, onClick, filled, outline }) => {
  return (
    <button
      onClick={onClick}
      className={`button ${filled && "filled"} ${outline && "outline"}`}
    >
      {text}
    </button>
  );
};

export default Button;
