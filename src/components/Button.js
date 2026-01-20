import "./Button.scss";

const Button = ({ text, onClick, filled, outline, filled_color, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`button ${filled && "filled"} ${outline && "outline"} ${
        filled_color && "filled_color"
      }`}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
