import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const cachedUser = JSON.parse(localStorage.getItem("localUser"));
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    console.log("Setting up");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedInUser(user);
      console.log("new user" + user.email);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
