import "./NavBar.scss";
import { useState } from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  const getUser = async () => {
    try {
      const usersRef = (db, "users");
      const q = query(usersRef, where("username", "==", `${params.username}`));
      const userDoc = await getDocs(q);

      userDoc.forEach((doc) => {
        setUsername(doc.data().username);
      });

      console.log(userDoc);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="NavBar">
      <Link to="/profile/:username">Profile</Link>
    </div>
  );
};

export default NavBar;
