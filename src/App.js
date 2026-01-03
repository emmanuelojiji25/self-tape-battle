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
import { VerifyEmail } from "./screens/VerifyEmail";
import Loader from "./components/Loader";

function App() {
  const { loggedInUser } = useContext(AuthContext);

  const [countryCode, setCountryCode] = useState("");

  const [loading, setLoading] = useState(true);

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
              <h1>No entry!</h1>
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
