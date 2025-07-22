import "./Profile.scss";

import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PollCard from "../components/PollCard";
import { db } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";

const Profile = () => {
  const params = useParams();

  const { loggedInUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [polls, setPolls] = useState([]);

  const [userIsFollowing, setUserIsFollowing] = useState(null);

  const getUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", `${params.username}`));
      const userDoc = await getDocs(q);

      userDoc.forEach((doc) => {
        setUsername(doc.data().username);
        setUserId(doc.data().userId);
        setFollowers(doc.data().followers);
        setFollowing(doc.data().following);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPolls = async () => {
    if (!userId) return;
    try {
      const pollsCollection = collection(db, "polls");
      const q = query(pollsCollection, where("userId", "==", userId));
      const docs = await getDocs(q);

      let data = [];

      docs.forEach((doc) => {
        data.push(doc.data());
      });
      setPolls(data);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFollow = async () => {
    if (!userId) return;
    try {
      const userRef = doc(db, "users", userId);
      if (!userIsFollowing) {
        await updateDoc(userRef, {
          followers: arrayUnion(loggedInUser.uid),
        });
      } else {
        await updateDoc(userRef, {
          followers: arrayRemove(loggedInUser.uid),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const followingCheck = async () => {
    if (!userId) return;
    const userRef = doc(db, "users", userId);

    const snapshot = await getDoc(userRef);

    const followers = snapshot.data().followers;

    if (followers.includes(loggedInUser.uid)) {
      setUserIsFollowing(true);
    } else {
      setUserIsFollowing(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [params.username]);

  useEffect(() => {
    getUserPolls();
    followingCheck();
  }, [userId]);

  return (
    <div className="Profile">
      <h1>{username}</h1>
      <span>Bio here</span>
      <span>{followers?.length}Followers</span>
      <span>{following?.length}Following</span>

      <button onClick={() => handleFollow()}>
        {userIsFollowing ? "Unfollow" : "Follow"}
      </button>
      {polls.map((poll) => (
        <PollCard
          type={poll.type}
          question={poll.question}
          category={poll.category}
          option1Content={poll.option1.option}
          option2Content={poll.option2.option}
          id={poll.id}
          userId={poll.userId}
        />
      ))}
    </div>
  );
};

export default Profile;
