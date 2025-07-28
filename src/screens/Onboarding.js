import { useState } from "react";
import Button from "../components/Button";
import "./Onboarding.scss";

const Onboarding = () => {
  const [view, setView] = useState(0);

  const handleViewChange = (view) => {
    setView(view)
  }

  return (
    <div className="Onboarding screen-width">
      <div className="carousel">
        <div
          className="carousel-inner"
          style={{ transform: `translateY(-${view * 100}%)` }}
        >
          <div className="carousel-item">
            {" "}
            <h1>Hey Name.</h1>
            <p>We just need some info then we'll get you into the arena!</p>
            <Button text="Let's go!" onClick={() => handleViewChange(1)} filled />
          </div>

          <div className="carousel-item"><h2>What's your first name?</h2>
          <Button text="Next" onClick={() => handleViewChange(2)} filled />
</div>

<div className="carousel-item"><h2>What's your last name?</h2>
          <Button text="Next" onClick={() => handleViewChange(3)} filled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
