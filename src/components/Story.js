import { useState } from "react";
import Button from "./Button";
import "./Story.scss";

const Story = ({ onClick }) => {
  return (
    <div className="Story">
      <h2>Welcome fighter</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc eu viverra
        erat. Morbi egestas placerat nisi a blandit. In mattis, velit non
        malesuada facilisis, quam ante iaculis nibh, eu volutpat erat ante sed
        mauris. Vivamus ac mattis quam, ut fermentum lectus. Suspendisse
        vehicula pellentesque ex a molestie. Suspendisse quis velit suscipit
        tortor pulvinar blandit at ac neque.
      </p>
      <Button filled text="Okay" onClick={onClick} />
    </div>
  );
};

export default Story;
