import { useContext, useEffect, useState } from "react";
import "./App.scss";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";

import { Route, Routes, Link } from "react-router-dom";
import Profile from "./screens/Profile";

import { AuthContext } from "./contexts/AuthContext";
import Battle from "./screens/Battle";

import Onboarding from "./screens/Onboarding";
import Dashboard from "./screens/Dashboard";
import Directory from "./screens/Directory";
import PrivateRoute from "./components/PrivateRoute";
import SharedVideo from "./components/SharedVideo";
import { VerifyEmail } from "./screens/VerifyEmail";
import Loader from "./components/Loader";
import Button from "./components/Button";

function App() {
  const [countryCode, setCountryCode] = useState("")

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCountry = async () => {
      if (localStorage.getItem("country_code")) {
        setCountryCode(localStorage.getItem("country_code"));
        setLoading(false);
      } else {
        try {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();

          const countryCode = data.country_code.toLowerCase();

          setCountryCode(countryCode);
          localStorage.setItem("country_code", countryCode);
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
    };
    getCountry();
  }, []);

  

  useEffect(() => {
    if (localStorage.getItem("country_code")) {
      console.log(localStorage.getItem("country_code"));
    }
  });

  return (
    <>
      <div className="App">
        {loading ? (
          <Loader />
        ) : (
          <>
            {countryCode !== "gb" ? (
              <div className="location-denied">
                <h2>There's no arena in your location yet.</h2>
                <p>We hope to be available in your country soon!</p>
                <Link to="/">
                  {" "}
                  <Button text="Go to homepage" filled_color />
                </Link>
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

                <Route
                  path="/arena/:battleId/:username"
                  element={<SharedVideo />}
                />
              </Routes>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
