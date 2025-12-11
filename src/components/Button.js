import "./Button.scss";

const Button = ({ text, onClick, filled, outline, filled_color }) => {
  return (
    <button
      onClick={onClick}
      className={`button ${filled && "filled"} ${outline && "outline"} ${
        filled_color && "filled_color"
      }`}
    >
      {text}
    </button>
  );
};

export default Button;
