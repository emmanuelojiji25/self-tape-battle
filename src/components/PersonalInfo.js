import {
  collection,
  doc,
  getDocs,
  getDocsFromServer,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Input from "./Input";
import "./PersonalInfo.scss";

const PersonalInfo = ({ user, setUser, originalUser }) => {
  const [showUsernameMessage, setShowUsernameMessage] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const updateField = (e, field) => {
    setUser({
      ...user,
      [field]: e.target.value,
    });
    console.log();
  };

  const handleUpdateUser = async () => {
    if (!originalUser) return; // early return if originalUser not loaded

    const updates = {};
    const username = user.username?.trim().toLowerCase() || "";
    const bio = user.bio?.trim() || "";
    const link = user.link?.trim() || "";

    const formattedLink =
      link.includes("https://") || link.includes("http://")
        ? link
        : `https://${link}`;

    if (username && username !== originalUser.username)
      updates.username = username;
    if (bio && bio !== originalUser.bio) updates.bio = bio;
    if (link && link !== originalUser.link) updates.webLink = formattedLink;

    if (updates !== originalUser) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, updates);
        console.log("User updated!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Edit headshot

  const inputRef = useRef(null);

  const [file, setFile] = useState([]);
  const [previewFile, setPreviewfile] = useState();

  const updateHeadshot = async () => {
    const storageRef = ref(storage, `headshots/${loggedInUser.uid}`);

    if (previewFile) {
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
    }
  };

  useEffect(() => {
    console.log(isUsernameAvailable);
    console.log(user.username);
  }, [user.username]);

  const handleUsernameCheck = async (username) => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("username", "==", username.toLowerCase().trim())
      );

      const querySnapshot = await getDocsFromServer(q);

      if (querySnapshot.size === 0) {
        console.log("Available!");
        setIsUsernameAvailable(true);
      } else {
        console.log("Unavailable!");
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="PersonalInfo">
      <div className="headshot-container">
        <div
          className="headshot"
          style={{
            backgroundImage: `url(${
              previewFile ? previewFile : user.headshot
            })`,
          }}
        ></div>

        <p onClick={() => inputRef.current.click()} className="highlight">
          Change headshot
        </p>
      </div>
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
        accept="image/jpeg, image/png"
      ></input>
      <Input type="text" value={user.firstName} disabled />
      <Input type="text" value={user.lastName} disabled />
      <Input
        type="text"
        onChange={(e) => {
          updateField(e, "username");
          handleUsernameCheck(e.target.value);
          setShowUsernameMessage(true);
        }}
        value={user.username}
        displayIcon={user.username != originalUser.username && user.username}
        available={isUsernameAvailable}
        placeholder="Username"
      />

      <Input
        name="bio"
        type="text"
        onChange={(e) => updateField(e, "bio")}
        value={user.bio}
        placeholder="Enter bio"
      />
      <Input
        type="text"
        onChange={(e) => updateField(e, "webLink")}
        value={user.link}
        placeholder="Enter link"
      />

      <Button filled_color text="Save" onClick={handleUpdateUser} />
    </div>
  );
};

export default PersonalInfo;
