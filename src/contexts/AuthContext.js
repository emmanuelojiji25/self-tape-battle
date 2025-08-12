import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authRole, setAuthRole] = useState("");

  useEffect(() => {
    console.log("Setting up");
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoggedInUser(user);
      setLoading(false);

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnapshot = await getDoc(docRef);
        setAuthRole(docSnapshot.data().role);
      } catch (error) {
        console.log(error);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInUser, loading, authRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
