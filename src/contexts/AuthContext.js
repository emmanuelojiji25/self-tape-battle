import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authRole, setAuthRole] = useState("");
  const [isEmailVerified, setIsEmailVerifed] = useState(null);

  useEffect(() => {
    console.log("Setting up");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoggedInUser(user);

      if (user) {
        setIsEmailVerifed(user.emailVerified);
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(docRef);
        setAuthRole(docSnapshot.data().role);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ loggedInUser, loading, authRole, isEmailVerified }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
