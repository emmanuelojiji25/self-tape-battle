import "./NavBar.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const NavBar = ({ user }) => {
  const [username, setUsername] = useState("");
  const getUser = async () => {
    try {
      const docRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(docRef);

      setUsername(userDoc.data().username);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user]);

  return (
    <div className="NavBar">
      {username && <Link to={`/profile/${username}`}>Profile</Link>}
    </div>
  );
};

export default NavBar;
