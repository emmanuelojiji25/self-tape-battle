import { useState } from "react";
import "./App.css";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";
import { auth } from "./firebaseConfig";

function App() {
  const [signedIn, setSignedIn] = useState(true);

  return (
    <div className="App">
      {signedIn && <Feed />}{" "}
      {!signedIn && <UserAuth setSignedIn={setSignedIn} />}
    </div>
  );
}

export default App;
