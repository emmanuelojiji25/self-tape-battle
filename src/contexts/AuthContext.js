import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { createContext, useEffect, useRef, useState } from "react";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authRole, setAuthRole] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(null);
  const [coins, setCoins] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [headshot, setHeadshot] = useState("");

  const [userDocLoaded, setUserDocLoaded] = useState(false)

  useEffect(() => {
    console.log("Setting up");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoggedInUser(user);

      setIsEmailVerified(user?.emailVerified);

      try {
        const userRef = doc(db, "users", user.uid);

        const unsubscribe = onSnapshot(
          userRef,
          (snapshot) => {
            const data = snapshot.data();
            setAuthRole(snapshot.data().role);
            setIsOnboardingComplete(snapshot.data().isOnboardingComplete);
            setCoins(snapshot.data()?.coins ?? 0); // defensive: if coins is undefined, fallback to 0
            setFirstName(snapshot.data().firstName);
            setUsername(snapshot.data().username);
            setHeadshot(snapshot.data().headshot);

            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user coins:", error);
          }
        );
        console.log("onboarding complete:" + isOnboardingComplete);
      } catch (error) {
        console.log(error);
      }
     
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setIsEmailVerified(auth.currentUser?.emailVerified);
  }, [auth.currentUser?.emailVerified]);

 
  return (
    <AuthContext.Provider
      value={{
        loggedInUser,
        loading,
        authRole,
        isEmailVerified,
        isOnboardingComplete,
        setIsOnboardingComplete,
        setIsEmailVerified,
        coins,
        firstName,
        username,
        headshot,
        userDocLoaded
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
