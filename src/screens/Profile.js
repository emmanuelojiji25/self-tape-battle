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
import PollCard from "../components/PollCard";
import { db } from "../firebaseConfig";

const Profile = () => {
  const params = useParams();

  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [polls, setPolls] = useState([]);

  const getUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", `${params.username}`));
      const userDoc = await getDocs(q);

      userDoc.forEach((doc) => {
        setUsername(doc.data().username);
        setUserId(doc.data().userId);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getUserPolls = async () => {
    try {
      const pollsCollection = collection(db, "polls");
      const q = query(pollsCollection, where("userId", "==", userId));
      const docs = await getDocs(q);

      let data = [];

      docs.forEach((doc) => {
        data.push(doc.data());
        setPolls(data);
      });

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  });

  useEffect(() => {
    getUserPolls();
  }, [userId]);

  return (
    <div className="Profile">
      <h1>{username}</h1>
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
