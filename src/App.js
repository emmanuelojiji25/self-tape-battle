import { useState } from "react";
import "./App.css";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import Profile from "./screens/Profile";

function App() {

  const [user, setUser] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      console.log(user.email);
    }
  });

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={user ? <Feed user={user} /> : <UserAuth />} />
        <Route path="/userAuth" element={<UserAuth />} />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
