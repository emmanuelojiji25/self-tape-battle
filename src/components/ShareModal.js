import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import "./ShareModal.scss";

const ShareModal = ({ battleId, uid, username, setShareModalVisible }) => {
  const [shareSetting, setShareSetting] = useState("private");

  const [isCopied, setIsCopied] = useState(false);

  const shareLink = `localhost:3000/arena/${battleId}/${username}`;

  useEffect(() => {
    if (!battleId || !uid) return;

    const entryRef = doc(db, "battles", battleId, "entries", uid);

    const unsub = onSnapshot(entryRef, (snapshot) => {
      if (snapshot.exists()) {
        setShareSetting(snapshot.data()?.shareSetting ?? "private");
      }
    });

    return () => unsub();
  }, [battleId, uid]);

  const handleUpdateSetting = async (e) => {
    const newSetting = e.target.checked ? "public" : "private";
    setShareSetting(newSetting);

    const entryRef = doc(db, "battles", battleId, "entries", uid);
    await updateDoc(entryRef, { shareSetting: newSetting });
  };

  return (
    <div className="share-modal-container">
      <div className="share-modal">
        <div className="share-modal-header">
          <h2>Share</h2>
          <h2 onClick={() => setShareModalVisible(false)}>X</h2>
        </div>

        <div className="message">
          {shareSetting === "public" && (
            <p>This entry can be viewed by users that aren't logged in</p>
          )}
          {shareSetting === "private" && (
            <p>This entry cannot be viewed by outsiders</p>
          )}
        </div>
        {shareSetting === "public" && (
          <span
            className="share-link"
            onClick={async () => {
              await navigator.clipboard.writeText(shareLink);
              setIsCopied(true);

              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {!isCopied ? "Copy Link" : "Copied!"}
          </span>
        )}

        <span>
          {" "}
          <input
            type="checkbox"
            onChange={handleUpdateSetting}
            checked={shareSetting === "public"}
          />
          Make entry public{" "}
        </span>
      </div>
    </div>
  );
};

export default ShareModal;
