import { async } from "@firebase/util";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import Button from "./Button";
import ConfirmationModal from "./ConfirmationModal";
import MessageModal from "./MessageModal";
import "./Wallet.scss";

const Wallet = ({visibleClass}) => {
  const { loggedInUser } = useContext(AuthContext);

  const [coins, setCoins] = useState();

  const [view, setView] = useState("coins");

  const [transactions, setTransactions] = useState([]);

  const [isWithdrawalPending, setIsWithdrawalPending] = useState(true);

  const [confirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  const pounds = coins / 100;

  const getUser = async () => {
    if (!loggedInUser) return; // prevent early calls

    const docRef = doc(db, "users", loggedInUser.uid);
    try {
      const docSnapshot = await getDoc(docRef);
      setCoins(docSnapshot.data().coins);
      setTransactions(docSnapshot.data().withdrawals);
      setIsWithdrawalPending(docSnapshot.data().withdrawlPending);
    } catch (error) {
      console.error(error);
    }
  };

  const handleWithdrawCoins = async () => {
    if (!loggedInUser) return;

    const docRef = doc(db, "users", loggedInUser.uid);
    if (coins >= 500 && !isWithdrawalPending) {
      try {
        await updateDoc(docRef, {
          withdrawals: arrayUnion({
            amount: coins,
            complete: false,
            uid: loggedInUser.uid,
            direction: "outbound",
          }),
          withdrawlPending: true,
        });

        setConfirmationModalVisible(false);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.log("cant withdraw yet!");

      //setConfirmationModalVisible(false);
    }
  };

  useEffect(() => {
    getUser();
  });

  return (
    <div className={`Wallet ${visibleClass}`}>
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
        onClick={() => setConfirmationModalVisible(true)}
      />

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
