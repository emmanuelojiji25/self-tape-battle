import { useState } from "react";
import "./App.css";
import UserAuth from "./screens/UserAuth";
import Feed from "./screens/Feed";

function App() {
  const [signedIn, setSignedIn] = useState(false);

  return (
    <div className="App">
      {signedIn && <Feed />}{" "}
      {!signedIn && <UserAuth setSignedIn={setSignedIn} />}
    </div>
  );
}

export default App;
