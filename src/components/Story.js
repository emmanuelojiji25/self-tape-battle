import { useState } from "react";
import Button from "./Button";
import Typewriter from "typewriter-effect";
import "./Story.scss";

const Story = ({ onClick }) => {
  return (
    <div className="Story">
      <h2>Welcome to the Arena</h2>

      <p>
        <Typewriter
          options={{
            strings: [
              "This will be a welcome message for actors and industry professionals. This will be a welcome message for actors and industry professionals. This will be a welcome message for actors and industry professionals. This will be a welcome message for actors and industry professionals. This will be a welcome message for actors and industry professionals.",
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
  );
};

export default Story;
