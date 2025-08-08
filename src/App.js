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
import Header from "./components/Header";
import Onboarding from "./screens/Onboarding";
import Dashboard from "./screens/Dashboard";
import Directory from "./screens/Directory";
import PrivateRoute from "./components/PrivateRoute";
import SharedVideo from "./components/SharedVideo";

function App() {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Feed />
            </PrivateRoute>
          }
        />

        <Route path="/userAuth" element={<UserAuth />} />

        <Route path="/profile/:username" element={<Profile />} />
        <Route
          path="/arena/:battleId"
          element={
            <PrivateRoute>
              <Battle />
            </PrivateRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <PrivateRoute>
              <Onboarding />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/directory"
          element={
            <PrivateRoute>
              <Directory />
            </PrivateRoute>
          }
        />

        <Route path="/arena/:battleId/:username" element={<SharedVideo />} />
      </Routes>
    </div>
  );
}

export default App;
