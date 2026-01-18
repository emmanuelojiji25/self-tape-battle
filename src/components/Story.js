import { useState } from "react";
import Button from "./Button";
import Typewriter from "typewriter-effect";
import "./Story.scss";

const Story = ({ onClick }) => {
  return (
    <div className="Story">
      <div className="inner screen-width">
        <h2>Welcome to the Arena</h2>

        <p>
          <Typewriter
            options={{
              strings: [
                "Good evening, residents. This is your council representative speaking. I wish to inform you that the arena is now open. All actors MUST report to their stations promptly and without haste. Sharpen your swords, your first battle awaits. Good luck.",
              ],
              autoStart: true,
              loop: true,
              delay: 60,
              cursor: "",
              deleteSpeed: Infinity,
            }}
          />
        </p>
        <Button filled_color text="Let's go!" onClick={onClick} />
      </div>
    </div>
  );
};

export default Story;
