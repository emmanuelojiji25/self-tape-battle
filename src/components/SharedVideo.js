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

const SharedVideo = () => {
  const { battleId, username } = useParams();
  const [user, setUser] = useState({});
  const [entry, setEntry] = useState("");

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

        console.log(entrySnap.data());
      }
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
          <h2>{user?.firstName}</h2>

          <EntryCard url={entry.url} />
        </>
      )}
    </div>
  );
};

export default SharedVideo;
