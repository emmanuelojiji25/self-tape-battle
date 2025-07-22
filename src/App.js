import { useEffect, useState } from "react";
import "./App.css";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import Profile from "./screens/Profile";
import NavBar from "./components/NavBar";

function App() {
  const [user, setUser] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <Feed user={user} /> : <UserAuth />} />
        <Route path="/userAuth" element={<UserAuth />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
      <NavBar user={user} />
    </div>
  );
}

export default App;
