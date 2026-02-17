import { useState } from "react";
import Input from "./Input";
import "./Dropdown.scss";

const Dropdown = ({ options, onChange, label}) => {
  const [isOpen, setIsOpen] = useState(false);

  
  return (
    <div className="Dropdown">
      <div className="select">
        {label}
        <h4 onClick={() => setIsOpen(!isOpen)}>Arrow</h4>
      </div>

      {isOpen && (
        <div className="open-container">
          <Input
            type="text"
            className="search"
            placeholder="Search for a location"
            onChange={onChange}
            
          />
          <div className="selections"></div>
          <div className="options">{options}</div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
