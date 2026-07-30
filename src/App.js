import "./App.scss";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";

import { Route, Routes, Link } from "react-router-dom";
import Profile from "./screens/Profile";

import Battle from "./screens/Battle";

import Onboarding from "./screens/Onboarding";
import Dashboard from "./screens/Dashboard";
import Directory from "./screens/Directory";
import PrivateRoute from "./components/PrivateRoute";
import SharedVideo from "./components/SharedVideo";
import { VerifyEmail } from "./screens/VerifyEmail";
import Button from "./components/Button";

function App() {
 

  const appAvailable = false;

  return (
    <>
      <div className="App">
        {!appAvailable ? (
          <div className="location-denied">
           <h1>Self Tape Battle is currently unavailable, while we undergo an exciting rebrand.</h1>
           <p>Follow our Instagram for further updates @selftapebattle </p>
          </div>
        ) : (
          
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
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/emailverification" element={<VerifyEmail />} />
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
        )}
      </div>
    </>
  );
}

export default App;
