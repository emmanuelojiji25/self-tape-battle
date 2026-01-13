import { useEffect, useState } from "react";
import HowToPlay from "./HowToPlay";
import "./SideMenu.scss";
import SubmitFeedback from "./SubmitFeedback";

const SideMenu = ({ slideIn, toggleMenu }) => {
  const [view, setView] = useState("none");

  const [outletSlideIn, setOutletSlideIn] = useState(false);

  const handleOutletToggle = (nextView) => {
    if (view === "none") {
      setView(nextView);

      setTimeout(() => {
        setOutletSlideIn(true);
      }, 10);
      console.log(view);
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

  const registry = {
    how_to_play: <HowToPlay />,
    submit_feedback: <SubmitFeedback />,
    contact: "",
  };

  return (
    <div className={`SideMenu ${slideIn && "slideIn"}`}>
      <h1 onClick={toggleMenu}>close</h1>
      <p>Profile</p>
      <p onClick={() => handleOutletToggle("how_to_play")}>How to play</p>
      <p onClick={() => handleOutletToggle("submit_feedback")}>
        Submit feedback
      </p>
      <p onClick={() => handleOutletToggle("contact")}>Contact</p>
      <p>Sign out</p>

      {view !== "none" && (
        <div className={`outlet ${outletSlideIn && "outletSlideIn"}`}>
          <h2 onClick={() => handleOutletToggle()}>back</h2>
          {registry[view]}
        </div>
      )}
    </div>
  );
};

export default SideMenu;
