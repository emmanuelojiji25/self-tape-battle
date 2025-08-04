import "./Input.scss";

const Input = ({ type, onChange, value, placeholder }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      className="Input"
      value={value}
      placeholder={placeholder}
    ></input>
  );
};

export default Input;
