import "./Input.scss";

const Input = ({ type, onChange, value, placeholder, disabled}) => {
  return (
    <input
      type={type}
      onChange={onChange}
      className={`Input ${disabled && "disabled"}`}
      value={value}
      placeholder={placeholder}
    ></input>
  );
};

export default Input;
