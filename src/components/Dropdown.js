import { useState } from "react";
import Input from "./Input";
import "./Dropdown.scss";

const Dropdown = ({ label, data, setData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [search, setSearch] = useState("");

  const filteredData = data.filter((item) =>
    item.name.includes(search.trim().toLowerCase())
  );

  const chosenArray = search ? filteredData : data;

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const selectOption = (name) => {
    setData((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, selected: !item.selected } : item
      )
    );
  };

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
            onChange={(e) => handleInputChange(e)}
          />
          <div className="selections"></div>
          <div className="options">
            {chosenArray.map((item) => (
              <div className="option">
                <h4>{item.name}</h4>
                <div
                  className={`checkbox ${item.selected && "selected"}`}
                  onClick={() => selectOption(item.name)}
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
