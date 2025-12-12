import { addDoc, collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";
import "./ReportModal.scss";

const ReportModal = ({ uid, battleId, url, setIsReportModalVisible }) => {
  const [reason, setReason] = useState("");

  const [isReportSent, setIsReportSent] = useState(false);
  const handleSendReport = async () => {
    const reportsRef = collection(db, "reports");
    await addDoc(reportsRef, {
      reason: reason,
      uid: uid,
      battleId: battleId,
      url: url,
    });

    setIsReportSent(true);
  };

  return (
    <div className="ReportModal">
      <div className="report-modal-inner">
        {!isReportSent ? (
          <>
            <h2>Reason for reporting</h2>
            <input
              type="text"
              onChange={(e) => setReason(e.target.value)}
            ></input>
          </>
        ) : (
          <h1>Sent!</h1>
        )}

        <div className="button-container">
          {!isReportSent && (
            <Button
              filled_color
              text="Send"
              onClick={() => handleSendReport()}
            />
          )}
          <Button
            outline
            text={isReportSent ? "Close" : "Cancel"}
            onClick={() => setIsReportModalVisible(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
