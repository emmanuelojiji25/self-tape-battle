import "./NavBar.scss";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import residents from "../media/residents.svg";
import icon_arena from "../media/icon_arena.svg";

const NavBar = () => {
  const { loggedInUser, authRole } = useContext(AuthContext);

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
        <Link to={`/`}>
          <div className="nav-icon-container">
            <img src={icon_arena} />
          </div>
        </Link>

        <Link to={`/directory`}>
          <div className="nav-icon-container">
            <img src={residents} className="residents" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
