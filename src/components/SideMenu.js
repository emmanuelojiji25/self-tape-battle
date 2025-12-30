import { useEffect, useState } from "react";
import "./SideMenu.scss";

const SideMenu = ({ slideIn, toggleMenu }) => {
  const [view, setView] = useState("none");

  const [outletSlideIn, setOutletSlideIn] = useState(false);

  const handleOutletToggle = (nextView) => {
    if (view === "none") {
      setView(nextView);

      setTimeout(() => {
        setOutletSlideIn(true);
      }, 10);
    } else {
      setOutletSlideIn(false);

      setTimeout(() => {
        setView("none");
      }, 300);
    }
  };

  useEffect(() => {
    console.log(view);
  }, [view]);

  return (
    <div className={`SideMenu ${slideIn && "slideIn"}`}>
      <h1 onClick={toggleMenu}>close</h1>
      <p>Profile</p>
      <p onClick={() => handleOutletToggle("how-to-play")}>How to play</p>
      <p onClick={() => handleOutletToggle("submit-feedback")}>
        Submit feedback
      </p>
      <p onClick={() => handleOutletToggle("contact")}>Contact</p>
      <p>Sign out</p>

      {view !== "none" && (
        <div className={`outlet ${outletSlideIn && "outletSlideIn"}`}>
          <h2 onClick={() => handleOutletToggle()}>back</h2>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
