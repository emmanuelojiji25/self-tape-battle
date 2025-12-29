import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import EntryCard from "./EntryCard";
import "./SharedVideo.scss";
import logo from "../media/logo-purple-white.svg";

const SharedVideo = () => {
  const { battleId, username } = useParams();
  const [user, setUser] = useState({});
  const [entry, setEntry] = useState("");

  const [battleName, setBattleName] = useState("");
  const [prize, setPrize] = useState("");

  const getVideo = async () => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const foundUser = snapshot.docs[0].data();
        setUser(foundUser);

        const entryRef = doc(db, "battles", battleId, "entries", foundUser.uid);
        const entrySnap = await getDoc(entryRef);

        const entry = entrySnap.data();
        setEntry(entry);
      }

      // Get battle info
      const battleRef = doc(db, "battles", battleId);
      const battleSnapshot = await getDoc(battleRef);

      setBattleName(battleSnapshot.data().title);
      setPrize(battleSnapshot.data().prize.value);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVideo();
  }, [battleId, username]);
  return (
    <div className="SharedVideo screen-width">
      {entry.shareSetting === "private" ? (
        <h1>Private</h1>
      ) : (
        <>
          <header>
            <img src={logo} />
          </header>
          
          <h2>{`${user?.firstName} ${user?.lastName}`}</h2>
          <h3>{battleName}</h3>
          <h3>{prize}</h3>

          <EntryCard url={entry.url} />
        </>
      )}
    </div>
  );
};

export default SharedVideo;
