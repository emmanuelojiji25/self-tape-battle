import "./Input.scss";

const Input = ({ type, onChange, value, placeholder, disabled }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      className={`Input ${disabled && "disabled"}`}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
    ></input>
  );
};

export default Input;
