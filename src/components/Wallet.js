import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./Wallet.scss";

const Wallet = () => {
  const { loggedInUser } = useContext(AuthContext);

  const [coins, setCoins] = useState();

  const [view, setView] = useState("coins");

  const pounds = coins / 100;

  const getUser = async () => {
    try {
      const docRef = doc(db, "users", loggedInUser.uid);
      const docSnapshot = await getDoc(docRef);

      setCoins(docSnapshot.data().coins);
    } catch (error) {}
  };

  useEffect(() => {
    getUser();
  });

  return (
    <div className="Wallet">
      <h2>wallet</h2>
      <h3>{view === "coins" ? coins : `£${pounds}`}</h3>
      <span
        onClick={() => {
          view === "coins" ? setView("pounds") : setView("coins");
        }}
      >
        View as {view === "coins" ? "pounds" : "coins"}
      </span>
    </div>
  );
};

export default Wallet;
