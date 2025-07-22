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

const Profile = () => {
  const params = useParams();

  const [username, setUsername] = useState("");

  const getUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", `${params.username}`));
      const userDoc = await getDocs(q);

      userDoc.forEach((doc) => {
        setUsername(doc.data().username);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="Profile">
      <h1>{username}</h1>
    </div>
  );
};

export default Profile;
