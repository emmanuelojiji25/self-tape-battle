import { useState } from "react";
import "./SideMenu.scss";

const SideMenu = ({ slideIn, toggleMenu }) => {
  const [view, setView] = useState("none");

  return (
    <div className={`SideMenu ${slideIn && "slideIn"}`}>
      <h1 onClick={toggleMenu}>close</h1>
      <p>Profile</p>
      <p>How to play</p>
      <p>Submit feedback</p>
      <p>Contact</p>
      <p>Sign out</p>

      <div className="outlet">
        <h2>title</h2>
      </div>
    </div>
  );
};

export default SideMenu;
