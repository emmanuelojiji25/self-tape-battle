import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./Header.scss";
import coin from "../media/stb_coin.svg";
import { Link } from "react-router-dom";
import { Resend } from "resend";
import Wallet from "./Wallet";
import Story from "./Story";
import scroll from "../media/scroll.png";

const Header = () => {
  const { loggedInUser, authRole } = useContext(AuthContext);
  const [coins, setCoins] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [headshot, setHeadshot] = useState("");

  const [walletVisible, setWalletVisible] = useState(false);

  const [storyVisible, setStoryVisible] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(true);

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
        setIsStoryComplete(data.isStoryComplete);
      },
      (error) => {
        console.error("Error fetching user coins:", error);
      }
    );

    return () => unsubscribe();
  }, [loggedInUser]);

  const userRef = doc(db, "users", loggedInUser.uid);

  const updateUserLoginStatus = async () => {
    await updateDoc(userRef, {
      isStoryComplete: true,
    });
  };

  return (
    <div className="Header">
      {storyVisible && (
        <Story
          onClick={() => {
            updateUserLoginStatus();
            setStoryVisible(false);
          }}
        />
      )}
      {walletVisible && <Wallet setWalletVisible={setWalletVisible} />}
      <div className="header-inner">
        <div className="greeting-container">
          <Link
            to={`/profile/${username}`}
            className="greeting-container-inner"
          >
            <img src={headshot} className="headshot" />
            <p>Emmanuel</p>
          </Link>
        </div>

        <div className="header-right">
          {!isStoryComplete && (
            <div className="scroll" onClick={() => setStoryVisible(true)}>
              <img src={scroll} className="scroll" />
            </div>
          )}
          {authRole === "actor" && (
            <>
              <div
                className="coins-container"
                onClick={() => setWalletVisible(true)}
              >
                <img src={coin} />
                {coins}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
