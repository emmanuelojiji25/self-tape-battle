import { useState } from "react";
import "./UserAuth.scss";
import { auth, db } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
        followers: [],
        following: [],
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
    <div className="UserAuth">
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
          <button onClick={() => handleSignUp()}>sign up</button>

          <span onClick={() => setView("sign-in")}>Sign In instead</span>
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
          <button onClick={() => handleSignIn()}>sign in</button>
          <span onClick={() => setView("sign-up")}>Sign Up instead</span>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
