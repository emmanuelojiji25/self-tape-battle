import { useEffect, useState } from "react";
import "./UserAuth.scss";
import { auth, db } from "../firebaseConfig";
import Input from "../components/Input";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Button from "../components/Button";
import { redirect, useNavigate } from "react-router-dom";

const UserAuth = ({ setSignedIn }) => {
  const navigate = useNavigate();

  const [view, setView] = useState("sign-in");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);

  const [showUsernameMessage, setShowUsernameMessage] = useState(false);
  const [showEmailMessage, setShowEmailMessage] = useState(false);

  const handleUsernameCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("username", "==", username.toLowerCase())
      );

      const querySnapshot = await getDocs(q);

      console.log(querySnapshot.docs);

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

  const handleEmailCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("email", "==", email.toLowerCase()));

      const querySnapshot = await getDocs(q);

      console.log(querySnapshot.docs);

      if (querySnapshot.docs.length === 0) {
        console.log("Available!");
        setIsEmailAvailable(true);
      }

      if (querySnapshot.docs.length === 1) {
        console.log("Unavailable!");
        setIsEmailAvailable(false);
      }

      console.log(isEmailAvailable);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleUsernameCheck();
  }, [username]);

  useEffect(() => {
    handleEmailCheck();
  }, [email]);

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
        webLink: "",
        isOnboardingComplete: false,
        headshot: "",
        uid: auth.currentUser.uid,
        role: "actor",
        withdrawalPending: false,
      });

      navigate("/onboarding");
    } catch (error) {
      console.log("Sorry, could not create user");
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in!");

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="UserAuth screen-width">
      {view === "sign-up" && (
        <div className="sign-up">
          <h2>I am a..</h2>

          <div className="sign-up-choice-container">
            <div className="sign-up-choice" onClick={() => setView("actor")}>
              Actor
            </div>

            <div className="sign-up-choice" onClick={() => setView("casting")}>
              Casting Director
            </div>
          </div>
        </div>
      )}

      {view === "actor" && (
        <div className="actor-sign-up">
          <h2>Hey actor!</h2>
          <Input
            type="text"
            placeholder="username"
            onChange={(e) => {
              setUsername(e.target.value);
              console.log(username);
              setShowUsernameMessage(true);
            }}
          />
          {showUsernameMessage && (
            <span style={{ color: "white" }}>
              {isUsernameAvailable ? "Available" : "Not available"}
            </span>
          )}

          <Input
            type="email"
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
              console.log(email);
              setShowEmailMessage(true);
            }}
          />

          {showEmailMessage && (
            <span style={{ color: "white" }}>
              {isEmailAvailable ? "Available" : "Not available"}
            </span>
          )}

          <Input
            type="password"
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
              console.log(password);
            }}
          />
          <Button onClick={() => handleSignUp()} text="Sign Up" filled>
            Sign up
          </Button>

          <span onClick={() => setView("sign-in")} className="auth-switch">
            Sign In instead
          </span>
          <span onClick={() => setView("casting")} className="auth-switch">
            I'm a casting director
          </span>
        </div>
      )}

      {view === "casting" && (
        <div className="casting">
          <h2>Hey CD!</h2>
          <p>
            For safety and verification purposes. Please email
            accounts@selftapebattle.com with your company name, website if
            applicable, or any social media. Emails must come from your company
            email. <br />
            <br />
            Your account will be set up manually within 24-48 hours.
          </p>
          <span onClick={() => setView("sign-in")} className="auth-switch">
            Sign In instead
          </span>
          <span onClick={() => setView("actor")} className="auth-switch">
            I'm an actor
          </span>
        </div>
      )}

      {view === "sign-in" && (
        <div className="sign-in">
          <h2>Sign In</h2>
          <Input
            type="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
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
