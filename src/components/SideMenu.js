import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { auth } from "../firebaseConfig";
import Contact from "./Contact";
import HowToPlay from "./HowToPlay";
import "./SideMenu.scss";
import SubmitFeedback from "./SubmitFeedback";

const SideMenu = ({ slideIn, toggleMenu }) => {
  const navigate = useNavigate();

  const { username } = useContext(AuthContext);

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
      <Link to={`/profile/${username}`}>
        <p>Profile</p>
      </Link>
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
