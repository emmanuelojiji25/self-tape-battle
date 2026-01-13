import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";
import "./Contact.scss";

const Contact = () => {
  return (
    <div className="Contact">
      <h2>Contact</h2>
      <p>For all enquiries, please email us at info@selftapebattle.com</p>
    </div>
  );
};

export default Contact;
