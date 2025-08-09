import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import "./ShareModal.scss";

const ShareModal = ({ battleId, uid, username }) => {
  const [shareSetting, setShareSetting] = useState("private");

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
        <h2>Share</h2>

        {shareSetting === "public" && (
          <p>This entry can be viewed by users that aren't logged in</p>
        )}
        {shareSetting === "private" && (
          <p>This entry cannot be viewed by outsiders</p>
        )}
        {shareSetting === "public" && (
          <span className="share-link">{`selftapebattle.com//arena/${battleId}/${username}`}</span>
        )}

        <input
          type="checkbox"
          onChange={handleUpdateSetting}
          checked={shareSetting === "public"}
        />
        <span>Make entry public</span>
      </div>
    </div>
  );
};

export default ShareModal;
