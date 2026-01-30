import "./Button.scss";

const Button = ({
  text,
  onClick,
  filled,
  outline,
  filled_color,
  icon,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`button ${filled && "filled"} ${outline && "outline"} ${
        filled_color && "filled_color"
      } ${disabled && "disabled"}`}
      disabled={disabled}
    >
      {icon}
      {text}
    </button>
  );
};

export default Button;
