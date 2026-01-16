import { useEffect, useState } from "react";
import "./UserAuth.scss";
import { auth, db } from "../firebaseConfig";
import Input from "../components/Input";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
import logo from "../media/logo-purple-white.svg";

const UserAuth = ({ setSignedIn }) => {
  const navigate = useNavigate();

  const [view, setView] = useState("sign-in");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const [isEmailAvailable, setIsEmailAvailable] = useState(null);

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const [error, setError] = useState("");

  const handleUsernameCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("username", "==", username.toLowerCase().trim())
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
    if (username.length === 0) {
      setUsernameError("Please enter a username");
    } else if (!isUsernameAvailable) {
      setUsernameError("This username is taken!");
    }

    if (!isEmailAvailable) {
      setEmailError("This email is taken!");
    }

    if (password.length === 0) {
      setPasswordError("Password must be at least 6 characters");
    }
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
        totalCoinsEarned: 0,
        webLink: "",
        isOnboardingComplete: false,
        headshot: "",
        uid: auth.currentUser.uid,
        role: "actor",
        transactions: [],
        withdrawalPending: false,
        settings: { publicProfile: true },
        contactEmail: "",
        contactNumber: "",
        accountName: "",
        accountNumber: "",
        sortCode: "",
      });

      await sendEmailVerification(auth.currentUser);

      navigate("/emailverification");
    } catch (error) {
      if (
        error.code === "auth/invalid-email" ||
        email.length < 0 ||
        !email.includes("@")
      ) {
        setEmailError("Please enter a valid email");
      }
    }
  };

  const handleSignIn = async () => {
    if (email.length === 0) {
      setEmailError("Please enter your email");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in!");

      navigate("/");
    } catch (error) {
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setLoginError("You entered a wrong email or password");
      } else if (error.code === "auth/invalid-email") {
        setEmailError("Please enter a valid email");
      }
    }
  };

  const handleUserInput = (e, fieldSetter, errorSetter) => {
    const value = e.target.value;
    fieldSetter(value);
    errorSetter("");
  };

  return (
    <div className="UserAuth screen-width">
      {view === "sign-up" && (
        <div className="sign-up">
          <h2>I am..</h2>

          <div className="sign-up-choice-container">
            <Button text="An actor" onClick={() => setView("actor")} filled />
            <Button
              text="An industry professional"
              onClick={() => setView("casting")}
              filled
            />
          </div>
        </div>
      )}

      {view === "actor" && (
        <div className="actor-sign-up">
          <img src={logo} />
          <h2>Hey actor!</h2>
          <Input
            type="text"
            placeholder="username"
            onChange={(e) => handleUserInput(e, setUsername, setUsernameError)}
            available={isUsernameAvailable}
            displayIcon={username.length > 0}
            error={usernameError}
          />

          <Input
            type="email"
            placeholder="email"
            onChange={(e) => handleUserInput(e, setEmail, setEmailError)}
            available={isEmailAvailable}
            displayIcon={email.length > 0}
            error={emailError}
          />

          <Input
            type="password"
            placeholder="password"
            onChange={(e) => handleUserInput(e, setPassword, setPasswordError)}
            error={passwordError}
          />

          <Button onClick={() => handleSignUp()} text="Sign Up" filled_color>
            Sign up
          </Button>

          <p onClick={() => setView("sign-in")} className="auth-switch">
            Sign In instead
          </p>
          <p onClick={() => setView("casting")} className="auth-switch">
            I'm a casting director
          </p>
        </div>
      )}

      {view === "casting" && (
        <div className="casting">
          <h2>Hey CD!</h2>
          <p>
            For safety and verification purposes. Please email
            <span className="highlight"> accounts@selftapebattle.com</span> with
            your company name, website if applicable, or any social media.
            Emails must come from your company email. <br />
            <br />
            Your account will be set up manually within 24-48 hours.
          </p>
          <p onClick={() => setView("sign-in")} className="auth-switch">
            Sign In instead
          </p>
          <p onClick={() => setView("actor")} className="auth-switch">
            I'm an actor
          </p>
        </div>
      )}

      {view === "sign-in" && (
        <div className="sign-in">
          <img src={logo} />
          <h2>Sign In</h2>
          <Input
            type="email"
            placeholder="email"
            onChange={(e) => {
              handleUserInput(e, setEmail, setEmailError);
            }}
            error={emailError}
          />
          <Input
            type="password"
            placeholder="password"
            onChange={(e) => {
              handleUserInput(e, setPassword, setPasswordError);
            }}
            error={passwordError}
          />
          {loginError && <span>{loginError}</span>}
          <Button onClick={() => handleSignIn()} text="Sign In" filled_color />
          <p onClick={() => setView("sign-up")} className="auth-switch">
            Sign Up instead
          </p>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
