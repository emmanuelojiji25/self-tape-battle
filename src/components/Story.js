import { useState } from "react";
import Button from "./Button";
import Typewriter from "typewriter-effect";
import "./Story.scss";

const Story = ({ onClick }) => {
  return (
    <div className="Story">
      <h2>Welcome fighter</h2>

      <p>
        <Typewriter
          options={{
            strings: [
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur iaculis consequat odio at porta. Morbi volutpat a purus a dapibus. Nam ut vulputate dui, eu gravida magna. Integer dapibus convallis dui nec dapibus. Mauris aliquet turpis nibh. Proin eu eleifend turpis, eget congue est. Nunc cursus tempus pharetra.",
            ],
            autoStart: true,
            loop: true,
            delay: 75,
            cursor: "",
            deleteSpeed: Infinity,
          }}
        />
      </p>
      <Button filled text="Okay" onClick={onClick} />
    </div>
  );
};

export default Story;
