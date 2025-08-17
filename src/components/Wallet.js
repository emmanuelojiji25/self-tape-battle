import { async } from "@firebase/util";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import MessageModal from "./MessageModal";
import "./Wallet.scss";

const Wallet = ({ visibleClass }) => {
  const { loggedInUser } = useContext(AuthContext);

  const [coins, setCoins] = useState();

  const [view, setView] = useState("coins");

  const [transactions, setTransactions] = useState([]);

  const [isWithdrawalPending, setIsWithdrawalPending] = useState(true);

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const [errorModalVisible, setErrorModalVisible] = useState(false);
  let errorMessage = "";

  const [MessageModalVisible, setMessageModalVisible] = useState(false);

  const pounds = coins / 100;

  const getUser = async () => {
    if (!loggedInUser) return; // prevent early calls

    const docRef = doc(db, "users", loggedInUser.uid);

    const collectionRef = collection(
      db,
      "users",
      loggedInUser.uid,
      "transactions"
    );

    try {
      const docSnapshot = await getDoc(docRef);

      const docs = await getDocs(collectionRef);

      let docsData = [];
      docs.forEach((doc) => {
        docsData.push(doc.data());
      });

      setCoins(docSnapshot.data().coins);
      setTransactions(docsData);
      setIsWithdrawalPending(docSnapshot.data().withdrawalPending);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdrawCoins = async () => {
    if (!loggedInUser) return;

    const collectionRef = collection(
      db,
      "users",
      loggedInUser.uid,
      "transactions"
    );

    const userRef = doc(db, "users", loggedInUser.uid);

    try {
      await addDoc(collectionRef, {
        amount: coins,
        complete: false,
        uid: loggedInUser.uid,
        direction: "outbound",
      });

      await updateDoc(userRef, {
        withdrawalPending: true,
      });

      setConfirmationModalVisible(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUser();
  });

  return (
    <div className={`Wallet ${visibleClass}`}>
      {MessageModalVisible && (
        <MessageModal
          title={
            isWithdrawalPending
              ? "You already have a pending withdrawal"
              : "Not enough coins sorry!"
          }
          buttonText="Close"
          onClick={() => setMessageModalVisible(false)}
        />
      )}
      {confirmationModalVisible && (
        <ConfirmationModal
          text="Would you like to withdraw money"
          confirm={() => handleWithdrawCoins()}
          cancel={() => setConfirmationModalVisible(false)}
        />
      )}
      <h2>wallet</h2>
      <h3>{view === "coins" ? coins : `£${pounds}`}</h3>
      <span
        onClick={() => {
          view === "coins" ? setView("pounds") : setView("coins");
        }}
      >
        View as {view === "coins" ? "pounds" : "coins"}
      </span>
      <Button
        filled
        text="Withdraw coins"
        onClick={() => {
          if (isWithdrawalPending) {
            errorMessage = "Widthdrawal is pending";
            setMessageModalVisible(true);
          } else if (coins < 500) {
            errorMessage = "Not enough coins!";
            setMessageModalVisible(true);
          } else {
            setConfirmationModalVisible(true);
          }
        }}
      />

      {errorModalVisible && <h1>Low balance</h1>}

      <h3>Transactions</h3>
      {transactions.map((transaction) => (
        <div className="transaction-row">
          <h4>
            {transaction.direction === "inbound" ? "Earnings" : "Withdrawal"}
          </h4>
          <span> +{transaction.amount}</span>
        </div>
      ))}
    </div>
  );
};

export default Wallet;
