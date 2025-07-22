import { useContext, useEffect, useState } from "react";
import "./App.css";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes } from "react-router-dom";
import Profile from "./screens/Profile";
import NavBar from "./components/NavBar";
import { AuthContext } from "./contexts/AuthContext";
import Battle from "./screens/Battle";

function App() {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={loggedInUser ? <Feed /> : <UserAuth />} />
        <Route path="/userAuth" element={<UserAuth />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/arena/:battleId" element={<Battle />} />
      </Routes>

      <NavBar />
    </div>
  );
}

export default App;
