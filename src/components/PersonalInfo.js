import {
  collection,
  doc,
  getDocs,
  getDocsFromServer,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, storage } from "../firebaseConfig";
import Button from "./Button";
import Input from "./Input";
import "./PersonalInfo.scss";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { AuthContext } from "../contexts/AuthContext";

import imageCompression from "browser-image-compression";


const PersonalInfo = ({
  user,
  setUser,
  originalUser,
  setEditProfileVisible,
}) => {
  const [showUsernameMessage, setShowUsernameMessage] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);

  const nav = useNavigate();

  const { loggedInUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const updateField = (e, field) => {
    setUser({
      ...user,
      [field]: e.target.value,
    });
    console.log(user);
  };

  const handleUpdateUser = async () => {
    if (!originalUser) return; // early return if originalUser not loaded

    const updates = {};

    const username = user.username?.trim().toLowerCase() || "";
    const bio = user.bio?.trim() || "";
    const link = user.webLink?.trim() || "";

    const formattedLink =
      link.includes("https://") || link.includes("http://")
        ? link
        : `https://${link}`;

    if (username && username != originalUser.username)
      updates.username = username;
    if (bio && bio != originalUser.bio) updates.bio = bio;
    if (link && link != originalUser.webLink) updates.webLink = formattedLink;
    storage

    if (updates != originalUser) {
      try {
        const docRef = doc(db, "users", user.uid);
        await updateDoc(docRef, updates);
        await updateHeadshot();
        console.log("User updated!");
        nav(`/profile/${user.username}`);

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

    if (!file) return;

    const extension = file.type.split("/")[1];
    const storageRef = ref(storage, `headshots/${loggedInUser.uid}.${extension}`);

    setLoading(true);
    try {

      const compressionOptions = {
        maxSizeMB: 1.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/webp"
      };

      const compressedImage = await imageCompression(file, compressionOptions);

      await uploadBytes(storageRef, compressedImage, {
        contentType: file.type,
      }).then(() => {
        getDownloadURL(ref(storage, `headshots/${loggedInUser.uid}.${extension}`)).then(
          async (url) => {
            const docRef = doc(db, "users", loggedInUser.uid);
            await updateDoc(docRef, {
              headshot: `${url}`,
            });
            console.log("complete!");
          }
        );
      });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

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
            backgroundImage: `url(${previewFile ? previewFile : user.headshot
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
        name="webLink"
        type="text"
        onChange={(e) => updateField(e, "webLink")}
        value={user.webLink}
        placeholder="Enter link"
      />

      <Button filled_color text="Save" onClick={handleUpdateUser} />
    </div>
  );
};

export default PersonalInfo;
