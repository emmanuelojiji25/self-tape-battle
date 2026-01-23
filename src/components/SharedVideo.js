import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import EntryCard from "./EntryCard";
import "./SharedVideo.scss";
import logo from "../media/logo-purple-white.svg";
import Button from "./Button";
import { AuthContext } from "../contexts/AuthContext";

const SharedVideo = () => {
  const { battleId, username } = useParams();
  const [user, setUser] = useState({});
  const [entry, setEntry] = useState("");

  const [battleName, setBattleName] = useState("");
  const [prize, setPrize] = useState("");

  const { loggedInUser } = useContext(AuthContext);

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
      {entry.shareSetting === "private" && !loggedInUser ? (
        <div className="private-entry">
          <h1>{user.firstName}'s entry is private.</h1>
          <Link to="/userAuth">
            <Button filled_color text="Enter Arena to view" />
          </Link>
        </div>
      ) : (
        <>
          <header>
            <img src={logo} />
          </header>

          <EntryCard url={entry.url} uid={user.uid} />
        </>
      )}
    </div>
  );
};

export default SharedVideo;
