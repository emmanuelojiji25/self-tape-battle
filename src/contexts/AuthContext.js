import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
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
  const [email, setEmail] = useState("");

  const [userDocLoaded, setUserDocLoaded] = useState(false);

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const resetUserDoc = () => {
      setAuthRole("");
      setIsOnboardingComplete(null);
      setCoins(0);
      setFirstName("");
      setUsername("");
      setHeadshot("");
      setEmail("");
      setUserDocLoaded(false);
    };

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
        unsubscribeUserDoc = null;
      }

      if (user) {
        setLoggedInUser(user);
        setIsEmailVerified(user?.emailVerified);

        try {
          const userRef = doc(db, "users", user.uid);

          unsubscribeUserDoc = onSnapshot(
            userRef,
            (snapshot) => {
              const data = snapshot.data();

              if (!data) {
                resetUserDoc();
                setLoading(false);
                return;
              }

              setAuthRole(data.role ?? "");
              setIsOnboardingComplete(data.isOnboardingComplete ?? null);
              setCoins(data.coins ?? 0);
              setFirstName(data.firstName ?? "");
              setUsername(data.username ?? "");
              setHeadshot(data.headshot ?? "");
              setEmail(data.email ?? "");
              setUserDocLoaded(true);

              setLoading(false);
            },
            (error) => {
              console.error("Error fetching user coins:", error);
            }
          );

          await updateDoc(userRef, {
            lastLogin: new Date(),
          });
        } catch (error) {
          console.error("Error setting up authenticated user:", error);
          setLoading(false);
        }
      } else {
        setLoggedInUser(null);
        setIsEmailVerified(null);
        resetUserDoc();
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc();
      }
    };
  }, []);

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
        userDocLoaded,
        email,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
