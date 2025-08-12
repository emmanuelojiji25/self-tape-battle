import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./Header.scss";
import coin from "../media/coin.svg";
import { Link } from "react-router-dom";
import { Resend } from "resend";
import Wallet from "./Wallet";

const Header = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [coins, setCoins] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [headshot, setHeadshot] = useState("");

  const [role, setRole] = useState("casting");

  const [walletVisible, setWalletVisible] = useState(false);

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
        setHeadshot(data.headshot);
      },
      (error) => {
        console.error("Error fetching user coins:", error);
      }
    );

    return () => unsubscribe();
  }, [loggedInUser]);

  return (
    <div className="Header">
      {walletVisible && <Wallet />}
      <div className="header-inner">
        <div className="greeting-container">
          <div
            className="avatar"
            style={{ backgroundImage: `url(${headshot})` }}
          ></div>
          <div>
            <h2 className="greeting">Welcome, {firstName}</h2>
            {role === "actor" && <p>Your next battle awaits you!</p>}
          </div>
        </div>
        <div className="header-right">
          {role === "actor" && (
            <div
              className="coins-container"
              onClick={() => setWalletVisible(true)}
            >
              <img src={coin} />
              {coins}
            </div>
          )}
          <Link to={`/profile/${username}`}></Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
