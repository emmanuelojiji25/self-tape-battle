import { Link } from "react-router-dom";
import Button from "./Button";
import "./ActorCard.scss";
import star from "../media/star_outline.svg";
import star_filled from "../media/star.svg";
import { db } from "../firebaseConfig";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { memo, useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

const ActorCard = memo(({ uid, thumbnail }) => {
  const { loggedInUser, authRole } = useContext(AuthContext);

  const [userIsBookmarked, setUserIsBookmarked] = useState(false);

  const [username, setUsername] = useState("");
  const [headshot, setHeadshot] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
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

    getActor();

    return unsubscribe;
  }, [loggedInUser?.uid, uid]);

  const getActor = async () => {
    const docRef = doc(db, "users", uid);

    try {
      const docSnapshot = await getDoc(docRef);
      const data = docSnapshot.data();
      setName(`${data.firstName} ${data.lastName}`);
      setHeadshot(data.headshot);
      setUsername(data.username);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookmarkActor = async () => {
    //if (!loggedInUser?.uid || !uid) return;

    console.log("clicked");

    const docRef = doc(db, "users", loggedInUser.uid, "bookmarks", uid);

    //Optimistic UI: flip immediately; onSnapshot will correct if write fails
    setUserIsBookmarked((prev) => !prev);

    try {
      if (!userIsBookmarked) {
        await setDoc(docRef, {
          uid,
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
          onClick={() => handleBookmarkActor()}
        />
      )}
      <div
        className="actor-card-headshot"
        style={{ backgroundImage: `url(${headshot})` }}
      />
      {!thumbnail && (
        <div>
          <Link to={`/profile/${username}`} className="actor-card-name">
            {name}
          </Link>
          <Link to={`/profile/${username}`}>
            <Button filled_color text="View Profile" />
          </Link>
        </div>
      )}
    </div>
  );
});

export default ActorCard;
