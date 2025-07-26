import { useState } from "react";
import "./UserAuth.scss";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Button from "../components/Button";

const UserAuth = ({ setSignedIn }) => {
  const [view, setView] = useState("sign-up");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
