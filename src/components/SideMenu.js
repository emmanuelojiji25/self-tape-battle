import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import Contact from "./Contact";
import HowToPlay from "./HowToPlay";
import "./SideMenu.scss";
import SubmitFeedback from "./SubmitFeedback";

const SideMenu = ({ slideIn, toggleMenu }) => {
  const navigate = useNavigate();

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
    contact: <Contact />,
  };

  return (
    <div className={`SideMenu ${slideIn && "slideIn"}`}>
      <h2 onClick={toggleMenu}>close</h2>
      <p>Profile</p>
      <p onClick={() => handleOutletToggle("how_to_play")}>How to play</p>
      <p onClick={() => handleOutletToggle("submit_feedback")}>
        Submit feedback
      </p>
      <p onClick={() => handleOutletToggle("contact")}>Contact</p>
      <p
        onClick={async () => {
          await auth.signOut();
          navigate("/userAuth");
          localStorage.clear();
        }}
      >
        Sign out
      </p>

      {view !== "none" && (
        <div className={`outlet ${outletSlideIn && "outletSlideIn"}`}>
          <h2 onClick={() => handleOutletToggle()}>back</h2>
          <div className="content">{registry[view]}</div>
        </div>
      )}
    </div>
  );
};

export default SideMenu;
