import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./Header.scss";

const Header = () => {
  const { loggedInUser } = useContext(AuthContext);
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (!loggedInUser) return;

    const userRef = doc(db, "users", loggedInUser.uid);

    // Setup real-time listener
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        const data = snapshot.data();
        setCoins(data?.coins ?? 0); // defensive: if coins is undefined, fallback to 0
      },
      (error) => {
        console.error("Error fetching user coins:", error);
      }
    );
    return () => unsubscribe();
  }, [loggedInUser]);

  return (
    <div className="Header">
      <h1>Self Tape Battle</h1>
      <span>Coins: {coins}</span>
    </div>
  );
};

export default Header;
