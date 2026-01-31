import { useContext, useEffect, useState } from "react";
import "./UserAuth.scss";
import { auth, db } from "../firebaseConfig";
import Input from "../components/Input";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import Button from "../components/Button";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../media/logo-purple-white.svg";
import Terms from "../components/Terms";
import PrivacyPolicy from "../components/PrivacyPolicy";
import { AuthContext } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const UserAuth = ({ setSignedIn }) => {
  const navigate = useNavigate();

  const { loggedInUser, loading } = useContext(AuthContext);

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

  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false);

  const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false);
  const [passwordResetError, setPasswordResetError] = useState("");

  const [amountOfUsers, setAmountOfUsers] = useState(0);

  useEffect(() => {
    // Check amount of users for sign up incentive
    const allUsersRef = collection(db, "users");
    onSnapshot(allUsersRef, (snapshot) => {
      setAmountOfUsers(snapshot.size);
      console.log(amountOfUsers);
    });
  }, []);

  const handleUsernameCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("username", "==", username.toLowerCase().trim())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        setIsUsernameAvailable(true);
      } else {
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(collectionRef, where("email", "==", email.toLowerCase()));

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        setIsEmailAvailable(true);
      } else {
        setIsEmailAvailable(false);
      }
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
    let hasError = false;

    // Validation
    if (username.length === 0) {
      setUsernameError("Please enter a username");
      hasError = true;
    } else if (!isUsernameAvailable) {
      setUsernameError("This username is taken!");
      hasError = true;
    }

    if (email.length === 0 || !email.includes("@")) {
      setEmailError("Please enter a valid email");
      hasError = true;
    } else if (!isEmailAvailable) {
      setEmailError("This email is taken!");
      hasError = true;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    }

    if (hasError) return; // Stop execution if any errors

    // Firebase signup
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", auth.currentUser.uid), {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
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
        battlesEntered: 0,
        badges: amountOfUsers < 250 && ["founding_fighter"],
      });

      await sendEmailVerification(auth.currentUser);
      navigate("/onboarding");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-email") {
        setEmailError("Please enter a valid email");
      } else if (error.code === "auth/email-already-in-use") {
        setEmailError("This email is already in use");
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
    fieldSetter(value.trim());
    errorSetter("");
  };

  const toggleTerms = () => setTermsVisible(!termsVisible);
  const togglePrivacyPolicy = () =>
    setPrivacyPolicyVisible(!privacyPolicyVisible);

  const [users, setUsers] = useState(0);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const snapshot = await getDocs(usersCollection);

        const users = [];

        snapshot.forEach((snapshot) => {
          users.push(snapshot.data());
        });

        setUsers(users);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, []);

  if (loading) {
    <Loader />;
  }

  if (loggedInUser) {
    return <Navigate to="/" />;
  }

  if (!loggedInUser) {
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
            {termsVisible && <Terms toggleTerms={toggleTerms} />}
            {privacyPolicyVisible && (
              <PrivacyPolicy togglePrivacyPolicy={togglePrivacyPolicy} />
            )}
            <img src={logo} />
            <h2>Hey actor!</h2>
            <p className="join-others">
              Join <span className="highlight">{users.length}</span> other
              actors in the arena!
            </p>
            <Input
              type="text"
              placeholder="username"
              onChange={(e) => {
                handleUserInput(e, setUsername, setUsernameError);
              }}
              onKeyDown={(e) => {
                if (e.code === "Space") {
                  e.preventDefault();
                }
              }}
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
              onChange={(e) =>
                handleUserInput(e, setPassword, setPasswordError)
              }
              error={passwordError}
            />

            <p>
              By signing up, you agree to our{" "}
              <span className="highlight" onClick={toggleTerms}>
                terms of use
              </span>{" "}
              and{" "}
              <span className="highlight" onClick={togglePrivacyPolicy}>
                privacy policy
              </span>
            </p>

            <Button onClick={handleSignUp} text="Sign Up" filled_color />
            <p onClick={() => setView("sign-in")} className="auth-switch">
              Sign In instead
            </p>
            <p onClick={() => setView("casting")} className="auth-switch">
              I'm an industry professional
            </p>
          </div>
        )}

        {view === "casting" && (
          <div className="casting">
            <h2>Hey professional!</h2>
            <p>
              For safety and verification purposes. Please email{" "}
              <span className="highlight">accounts@selftapebattle.com</span>{" "}
              with your company name, website if applicable, or any social
              media. Emails must come from your company email. <br />
              <br />
              Your account will be set up manually within 24-48 hours.
            </p>
            <Button
              text="Sign in instead"
              outline
              onClick={() => setView("sign-in")}
            />
            <Button
              text="I'm an actor"
              outline
              onClick={() => setView("actor")}
            />
          </div>
        )}

        {view === "sign-in" && (
          <div className="sign-in">
            <img src={logo} />
            <h2>Sign In</h2>

            <Input
              type="email"
              placeholder="email"
              onChange={(e) => handleUserInput(e, setEmail, setEmailError)}
              error={emailError}
            />
            <Input
              type="password"
              placeholder="password"
              onChange={(e) =>
                handleUserInput(e, setPassword, setPasswordError)
              }
              error={passwordError}
            />
            <p className="highlight" onClick={() => setView("forgot_password")}>
              Forgot password
            </p>
            {loginError && <span>{loginError}</span>}
            <Button onClick={handleSignIn} text="Sign In" filled_color />

            <p onClick={() => setView("sign-up")} className="auth-switch">
              Sign Up instead
            </p>
          </div>
        )}

        {view === "forgot_password" && (
          <div className="forgot_passwoord">
            <h3>Forgot password</h3>
            <p>
              {!passwordResetEmailSent
                ? "Please enter your email to receive a password reset link. It may take up to 10 minutes to deliver and may land in your spam folder."
                : "Your password reset email has been sent to you. It may take up to minutes to deliver and may land in your spam folder."}
            </p>
            {!passwordResetEmailSent && (
              <Input
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={passwordResetError}
              />
            )}
            <div className="button-container">
              <Button
                filled_color
                text={
                  !passwordResetEmailSent ? "Send reset link" : "Resend link"
                }
                disabled={passwordResetEmailSent}
                onClick={async () => {
                  try {
                    await sendPasswordResetEmail(auth, email);
                    setPasswordResetEmailSent(true);

                    setTimeout(() => {
                      setPasswordResetEmailSent(false);
                    }, 60000);
                  } catch (error) {
                    console.log(error);
                    if (error.code === "auth/user-not-found") {
                      setPasswordResetError("User not found!");
                    }
                  }
                }}
              />
              {!passwordResetEmailSent && (
                <Button
                  outline
                  text="Nevermind"
                  onClick={() => setView("sign-in")}
                />
              )}
            </div>
            {passwordResetEmailSent && (
              <p>
                Please wait 1 minute before requesting another password reset
                link
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
};

export default UserAuth;
