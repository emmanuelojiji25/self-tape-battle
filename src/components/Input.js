import "./Input.scss";

const Input = ({
  type,
  onChange,
  value,
  placeholder,
  disabled,
  displayIcon,
  available,
  error,
  link,
  onKeyDown,
}) => {
  return (
    <div className="input-container">
      <div className="input-container-inner">
        <input
          type={type}
          onChange={onChange}
          className={`Input ${disabled && "disabled"}`}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onKeyDown={onKeyDown}
        ></input>
      </div>
      {error && <span>{error}</span>}
      {displayIcon && (
        <div className="input-icon-container">
          {available ? (
            <i class="fa-solid fa-circle-check"></i>
          ) : (
            <i class="fa-solid fa-circle-xmark"></i>
          )}
        </div>
      )}
    </div>
  );
};

export default Input;
