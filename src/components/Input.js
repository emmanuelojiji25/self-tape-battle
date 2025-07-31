import "./Input.scss";

const Input = ({ type, onChange }) => {
  return (
    <input
      type={type}
      onChange={onChange}
      className="Input"
    ></input>
  );
};

export default Input;
