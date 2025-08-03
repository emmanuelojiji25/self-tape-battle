import "./Input.scss";

const Input = ({ type, onChange, value }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      className="Input"
      value={value}
    ></input>
  );
};

export default Input;
