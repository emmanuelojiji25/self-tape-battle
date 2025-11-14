import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./Header.scss";
import coin from "../media/stb_coin.svg";
import { Link } from "react-router-dom";
import { Resend } from "resend";
import Wallet from "./Wallet";

const Header = () => {
  const { loggedInUser, authRole } = useContext(AuthContext);
  const [coins, setCoins] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [headshot, setHeadshot] = useState("");

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
    <div className="Header screen-width">
      {walletVisible && <Wallet setWalletVisible={setWalletVisible} />}
      <div className="header-inner">
        <div className="greeting-container"></div>
        <div className="header-right">
          {authRole === "actor" && (
            <div
              className="coins-container"
              onClick={() => setWalletVisible(true)}
            >
              <img src={coin} />
              {coins}
            </div>
          )}
          <Link to={`/profile/${username}`}>
            <img src={headshot} className="headshot" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
