import { useState } from "react";
import "./App.css";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [signedIn, setSignedIn] = useState(false);

  const [user, setUser] = useState();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      console.log(user.email);
    }
  });

  return (
    <div className="App">
      {user && <Feed user={user} />}{" "}
      {!user && <UserAuth setSignedIn={setSignedIn} />}
    </div>
  );
}

export default App;
