import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";
import { db, storage } from "../firebaseConfig";
import ConfettiExplosion from "react-confetti-explosion";

import "./Onboarding.scss";
import { useNavigate } from "react-router-dom";

const Onboarding = () => {
  const navigate = useNavigate();

  const [view, setView] = useState(0);

  const [file, setFile] = useState(null);
  const [previewFile, setPreviewfile] = useState("");

  const [username, setUsername] = useState("");

  const { loggedInUser, setIsOnboardingComplete } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [webLink, setWebLink] = useState("");
  const [headshot, setHeadshot] = useState("headshot");

  const [errorView, setErrorView] = useState("");

  const inputRef = useRef(null);

  const handleNextView = (state, nextView, errorView) => {
    if (state) {
      setView(nextView);
    } else {
      setErrorView(errorView);
    }
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
        isOnboardingComplete: true,
        coins: 100,
      });

      setIsOnboardingComplete(true);

      handleNextView(webLink, 5, 5);
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
              onClick={() => handleNextView(loggedInUser, 1)}
              filled
            />
          </div>

          <div className="carousel-item">
            <h2>What's your first name?</h2>
            <Input type="text" onChange={(e) => setFirstName(e.target.value)} />
            {errorView === 1 && <p>Please fill out first name</p>}
            <div>
              <Button
                text="Next"
                onClick={() => handleNextView(firstName, 2, 1)}
                filled
              />

              <Button text="Back" onClick={() => setView(view - 1)} outline />
            </div>
          </div>

          <div className="carousel-item">
            <h2>What's your last name?</h2>
            <Input type="text" onChange={(e) => setLastName(e.target.value)} />
            {errorView === 2 && <p>Please enter your last name</p>}
            <div>
              <Button
                text="Next"
                onClick={() => handleNextView(lastName, 3, 2)}
                filled
              />

              <Button text="Back" onClick={() => setView(view - 1)} outline />
            </div>
          </div>

          <div className="carousel-item">
            <h2>Do you have any web links?</h2>
            <Input type="text" onChange={(e) => setWebLink(e.target.value)} />
            {errorView === 3 && <p>Please enter your web link</p>}
            <div>
              <Button
                text="Next"
                onClick={() => handleNextView(webLink, 4, 3)}
                filled
              />

              <Button text="Back" onClick={() => setView(view - 1)} outline />
            </div>
          </div>

          <div className="carousel-item">
            <h2>
              {!file
                ? "Let's see that fierce headshot!"
                : `Looking good ${firstName}!`}
            </h2>
            <input
              type="file"
              style={{ display: "none" }}
              ref={inputRef}
              onChange={(e) => {
                const newFile = e.target.files;
                if (newFile && newFile[0]) {
                  setFile(newFile[0]);
                  const preview = window.URL.createObjectURL(newFile[0]);
                  setPreviewfile(preview);
                }
              }}
            ></input>
            <div
              className="headshot-placeholder"
              onClick={() => inputRef.current.click()}
              style={{ backgroundImage: `url(${previewFile})` }}
            >
              {!file && "Click to upload"}
            </div>
            {errorView === 4 && <p>Please upload a headshot</p>}
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
              <Button text="Enter Arena" onClick={() => navigate("/")} filled />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
