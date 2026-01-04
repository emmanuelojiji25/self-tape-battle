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
import SideMenu from "./SideMenu";

const Header = () => {
  const { loggedInUser, authRole, firstName, username, headshot, coins } =
    useContext(AuthContext);

  const [walletVisible, setWalletVisible] = useState(false);

  const [storyVisible, setStoryVisible] = useState(false);
  const [isStoryComplete, setIsStoryComplete] = useState(true);

  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const [slideIn, setSlideIn] = useState(false);

  const toggleMenu = () => {
    if (sideMenuVisible === false) {
      setSideMenuVisible(true);

      setTimeout(() => {
        setSlideIn(true);
      }, 50);
    } else {
      setSlideIn(false);

      setTimeout(() => {
        setSideMenuVisible(false);
      }, 300);
    }
  };

  useEffect(() => {
    if (!loggedInUser) return;

    const userRef = doc(db, "users", loggedInUser.uid);

    // Setup real-time listener
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        const data = snapshot.data();
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
      {sideMenuVisible && (
        <SideMenu slideIn={slideIn} toggleMenu={() => toggleMenu()} />
      )}
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
          <i class="fa-solid fa-bars" onClick={() => toggleMenu()}></i>
        </div>

        <div className="header-right">
          {!isStoryComplete && (
            <div className="scroll" onClick={() => setStoryVisible(true)}>
              <img src={scroll} className="scroll" />
            </div>
          )}
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
