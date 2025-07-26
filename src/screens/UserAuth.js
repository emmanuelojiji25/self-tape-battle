import { useEffect, useState } from "react";
import "./UserAuth.scss";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Button from "../components/Button";

const UserAuth = ({ setSignedIn }) => {
  const [view, setView] = useState("sign-up");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const [showUsernameMessage, setShowUsernameMessage] = useState();

  const handleUsernameCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("username", "==", username));

      const querySnapshot = await getDocs(q);

      console.log(querySnapshot.docs);

      setShowUsernameMessage(true);

      if (querySnapshot.docs.length === 0) {
        console.log("Available!");
        setIsUsernameAvailable(true);
      }

      if (querySnapshot.docs.length === 1) {
        console.log("Unavailable!");
        setIsUsernameAvailable(false);
      }

      console.log(isUsernameAvailable);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleUsernameCheck();
  }, [username]);

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log(auth.currentUser.uid);

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: username,
        email: email,
        firstName: "",
        lastName: "",
        bio: "",
        coins: 0,
        link: "",
      });

      setSignedIn(true);
    } catch (error) {
      console.log("Sorry, could not create user");
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in!");
      setSignedIn(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="UserAuth screen-width">
      {view === "sign-up" && (
        <div className="sign-up">
          <h1>Sign Up</h1>
          <input
            type="text"
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
              console.log(username);
            }}
          />
          {showUsernameMessage && (
            <span style={{ color: "white" }}>
              {isUsernameAvailable ? "Available" : "Not available"}
            </span>
          )}

          <input
            type="email"
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
              console.log(email);
            }}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
              console.log(password);
            }}
          />
          <Button onClick={() => handleSignUp()} text="Sign Up" filled>
            sign up
          </Button>

          <span onClick={() => setView("sign-in")} className="auth-switch">
            Sign In instead
          </span>
        </div>
      )}

      {view === "sign-in" && (
        <div className="sign-up">
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={() => handleSignIn()} text="Sign In" filled />
          <span onClick={() => setView("sign-up")} className="auth-switch">
            Sign Up instead
          </span>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
