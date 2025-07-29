import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./Header.scss";
import coin from "../media/coin.svg";
import { Link } from "react-router-dom";

const Header = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [coins, setCoins] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!loggedInUser) return;

    const userRef = doc(db, "users", loggedInUser.uid);

    // Setup real-time listener
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        const data = snapshot.data();
        setCoins(data?.coins ?? 0); // defensive: if coins is undefined, fallback to 0
        setFirstName(data.firstName);
        setUsername(data.username);
      },
      (error) => {
        console.error("Error fetching user coins:", error);
      }
    );

    return () => unsubscribe();
  }, [loggedInUser]);

  return (
    <div className="Header screen-width">
      <div className="header-inner">
        <div className="greeting-container">
          <h2 className="greeting">Welcome, {firstName}</h2>
          <p>Your next battle awaits you!</p>
        </div>
        <div className="header-right">
          <div className="coins-container">
            <img src={coin} />
            {coins}
          </div>
          <Link to={`/profile/${username}`}>
            <div className="avatar"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
