import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
import { db, storage } from "../firebaseConfig";
import ConfettiExplosion from "react-confetti-explosion";

import "./Onboarding.scss";

const Onboarding = () => {
  const [view, setView] = useState(0);

  const [file, setFile] = useState([]);

  const [username, setUsername] = useState("");

  const { loggedInUser } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [webLink, setWebLink] = useState("");

  const handleViewChange = (view) => {
    setView(view);
  };

  const getUsername = async () => {
    try {
      const docRef = doc(db, "users", loggedInUser.uid);

      const docSnapshot = await getDoc(docRef);

      setUsername(docSnapshot.data().username);
    } catch (error) {}
  };

  const handleCompleteOnboarding = async () => {
    const storageRef = ref(storage, `headshots/${loggedInUser.uid}`);
    try {
      await uploadBytes(storageRef, file).then(() => {
        getDownloadURL(ref(storage, `headshots/${loggedInUser.uid}`)).then(
          async (url) => {
            const docRef = doc(db, "users", loggedInUser.uid);
            await updateDoc(docRef, {
              headshot: `${url}`,
            });
            console.log("complete!");
          }
        );
      });

      const docRef = doc(db, "users", loggedInUser.uid);
      await updateDoc(docRef, {
        firstName: firstName,
        lastName: lastName,
        webLink: webLink,
      });

      handleViewChange(view + 1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsername();
  }, [loggedInUser]);

  return (
    <div className="Onboarding screen-width">
      <div className="carousel">
        <div
          className="carousel-inner"
          style={{ transform: `translateY(-${view * 100}%)` }}
        >
          <div className="carousel-item">
            {" "}
            <h1>Hey {username}</h1>
            <p>Let's get your profile finished!</p>
            <Button
              text="Let's go!"
              onClick={() => handleViewChange(1)}
              filled
            />
          </div>

          <div className="carousel-item">
            <h2>What's your first name?</h2>
            <Input type="text" onChange={(e) => setFirstName(e.target.value)} />
            <div>
              <Button text="Next" onClick={() => handleViewChange(2)} filled />

              <Button
                text="Back"
                onClick={() => handleViewChange(view - 1)}
                outline
              />
            </div>
          </div>

          <div className="carousel-item">
            <h2>What's your last name?</h2>
            <Input type="text" onChange={(e) => setLastName(e.target.value)} />
            <div>
              <Button text="Next" onClick={() => handleViewChange(3)} filled />

              <Button
                text="Back"
                onClick={() => handleViewChange(view - 1)}
                outline
              />
            </div>
          </div>

          <div className="carousel-item">
            <h2>Do you have any web links?</h2>
            <Input type="text" onChange={(e) => setWebLink(e.target.value)} />
            <div>
              <Button text="Next" onClick={() => handleViewChange(4)} filled />

              <Button
                text="Back"
                onClick={() => handleViewChange(view - 1)}
                outline
              />
            </div>
          </div>

          <div className="carousel-item">
            <h2>Let's see that fierce headshot!</h2>
            <Input type="text" />
            <div>
              <Button
                text="Next"
                onClick={() => handleCompleteOnboarding()}
                filled
              />
              <Button text="Back" onClick={() => setView(view - 1)} outline />
            </div>
          </div>

          <div className="carousel-item centered">
            <h1>You're in, {firstName}!</h1>
            <p>You've earned 100 coins</p>
            <ConfettiExplosion />
            <div>
              <Button
                text="Enter Arena"
                onClick={() => handleViewChange(4)}
                filled
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
