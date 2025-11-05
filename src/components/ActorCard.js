import { Link } from "react-router-dom";
import Button from "./Button";
import "./ActorCard.scss";
import star from "../media/star.svg";
import star_filled from "../media/star-filled.svg";
import { db } from "../firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ActorCard = ({ name, bio, headshot, username, uid }) => {
  const { loggedInUser, authRole } = useContext(AuthContext);

  const [userIsBookmarked, setUserIsBookmarked] = useState(false);

  useEffect(() => {
    if (!loggedInUser?.uid || !uid) return;

    const docRef = doc(db, "users", loggedInUser.uid, "bookmarks", uid);
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        setUserIsBookmarked(snap.exists());
      },
      (err) => {
        console.error("Bookmark listener error:", err);
      }
    );

    return unsubscribe;
  }, [loggedInUser?.uid, uid]);

  const handleBookmarkActor = async () => {
    if (!loggedInUser?.uid || !uid) return;

    const docRef = doc(db, "users", loggedInUser.uid, "bookmarks", uid);

    // Optimistic UI: flip immediately; onSnapshot will correct if write fails
    setUserIsBookmarked((prev) => !prev);

    try {
      if (!userIsBookmarked) {
        await setDoc(docRef, {
          uid,
          type: "actor",
          // you can add serverTimestamp() or other fields if needed
        });
      } else {
        await deleteDoc(docRef);
      }
    } catch (error) {
      console.error(error);
      // revert if write failed
      setUserIsBookmarked((prev) => !prev);
    }
  };

  return (
    <div className="ActorCard">
      {authRole === "professional" && (
        <img
          src={userIsBookmarked ? star_filled : star}
          className="star"
          alt="bookmark"
          onClick={() => handleBookmarkActor}
        />
      )}
      <div
        className="actor-card-headshot"
        style={{ backgroundImage: `url(${headshot})` }}
      />
      <div>
        <Link to={`/profile/${username}`}>{name}</Link>
        <Button filled text="View Profile" />
      </div>
    </div>
  );
};

export default ActorCard;
