import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const cachedUser = JSON.parse(localStorage.getItem("localUser"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("Setting up");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("new user" + user.email);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
