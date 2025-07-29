import "./Input.scss";

const Input = ({ type, onChange }) => {
  return <input type={type} onChange={onChange}></input>;
};

export default Input;
