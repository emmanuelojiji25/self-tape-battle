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
import coin from "../media/stb_coin.svg";
import emailjs from "@emailjs/browser";
import BackButton from "./BackButton";
import {Coin} from "./Icon";

const Wallet = ({ visibleClass, setWalletVisible }) => {
  const { loggedInUser, email } = useContext(AuthContext);

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
      const newDoc = await addDoc(collectionRef, {
        amount: coins,
        status: "pending",
        uid: loggedInUser.uid,
        direction: "outbound",
      });

      const docRef = doc(
        db,
        "users",
        loggedInUser.uid,
        "transactions",
        newDoc.id
      );

      await updateDoc(docRef, {
        id: newDoc.id,
      });

      await updateDoc(userRef, {
        withdrawalPending: true,
      });

      emailjs.init({
        publicKey: "vDAbvtQ-t4ao0CqWi",
      });

      const info = {
        email: email,
        amount: coins,
      };

      emailjs.send("service_v3a3sw5", "template_adqujmn", info);

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
      <div className="screen-width">
        {MessageModalVisible && (
          <MessageModal
            confetti={false}
            title={
              isWithdrawalPending
                ? "You already have a pending withdrawal"
                : "You must have at least 500 coins to make a withdrawal."
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
        <BackButton onClick={() => setWalletVisible(false)} />
        <h2>Wallet</h2>

        <div className="amount-button-container">
          <div className="coin-container">
            {view === "coins" && <Coin width="50"/>}
            <h3 className="amount">
              {view === "coins" ? coins : `£${pounds}`}
            </h3>
          </div>

          <div className="button-container">
            <Button
              onClick={() => {
                view === "coins" ? setView("pounds") : setView("coins");
              }}
              text={` View as ${view === "coins" ? "pounds" : "coins"}`}
              outline
            />
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
          </div>
        </div>

        {errorModalVisible && <h1>Low balance</h1>}

        <h3 className="transaction-title">Transactions</h3>
        {transactions.length === 0 && <p>No transactions</p>}
        {transactions.map((transaction) => (
          <div className="transaction-row">
            <div>
              <h4>
                {transaction.direction === "inbound"
                  ? "Earnings"
                  : "Withdrawal"}
              </h4>
              <p className={`transaction-status ${transaction.status}`}>
                {transaction.status}
              </p>
            </div>
            <span>
              {transaction.direction === "inbound" ? "+" : "-"}{" "}
              {transaction.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wallet;
