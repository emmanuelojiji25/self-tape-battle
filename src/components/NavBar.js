import "./NavBar.scss";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";

const NavBar = () => {
  const { loggedInUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const getUser = async () => {
    try {
      const docRef = doc(db, "users", loggedInUser.uid);
      const userDoc = await getDoc(docRef);

      setUsername(userDoc.data().username);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [loggedInUser]);

  return (
    <div className="NavBar">
      <div className="nav-bar-inner">
        <Link to={`/`}>Arena</Link>
        {username && <Link to={`/profile/${username}`}>Profile</Link>}
      </div>
    </div>
  );
};

export default NavBar;
