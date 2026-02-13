import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebaseConfig";
import "./Comment.scss";

const Comment = ({ comment, uid }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    console.log("mounted");
    try {
      const getUser = async () => {
        const userRef = doc(db, "users", uid);

        const snapshot = await getDoc(userRef);

        setUser(snapshot.data());
      };
      getUser();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="Comment">
      <div
        className="headshot"
        style={{ backgroundImage: `url(${user?.headshot})` }}
      ></div>
      <div className="comment-right">
        <Link to={`/profile/${user?.username}`}>
          <h4>{`${user?.firstName} ${user?.lastName}`}</h4>
        </Link>
        <p>{comment}</p>
      </div>
    </div>
  );
};

export default Comment;
