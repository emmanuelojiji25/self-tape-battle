import { doc, updateDoc } from "firebase/firestore";
import { useRef, useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Input from "./Input";
import "./PersonalInfo.scss";


const PersonalInfo = ({ user, setUser, originalUser }) => {
  const [showUsernameMessage, setShowUsernameMessage] = useState(false);

  const updateField = (e, field) => {
    console.log("typings")
    setUser({
      ...user,
      [field]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    const updates = {};
    try {
      const docRef = doc(db, "users", user.uid);

      if (user.username.trim().toLowerCase() !== originalUser.username) {
        updates.username = user.username.trim().toLowerCase();
      }

      if (user.bio.trim() !== originalUser.bio) {
        updates.bio = user.bio.trim();
      }
      
      if (user.link.trim() !== originalUser.link) {
        updates.webLink =
          user.link.includes("https://") || user.link.includes("http://")
            ? user.link.trim()
            : `https://${user.link}`;
      }

      if (updates.length != 0){
        try{
          await updateDoc(docRef, updates)
        } catch(error){
          console.log(error)
        }
      }
    } catch (error) {
      console.log(error);
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

  const handleUsernameCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("username", "==", user.username.toLowerCase().trim())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        console.log("Available!");
        setIsUsernameAvailable(true);
      }

      if (querySnapshot.docs.length === 1) {
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
          setUsername(e.target.value);
          setShowUsernameMessage(true);
        }}
        value={user.username}
      />
      {showUsernameMessage && (
        <span style={{ color: "white" }}>
          {isUsernameAvailable ? "Available" : "Not available"}
        </span>
      )}

      <Input
        name="bio"
        type="text"
        onChange={(e) => updateField(e, "bio")}
        value={user.bio}
        placeholder="Enter bio"
      />
      <Input
        type="text"
        onChange={(e) => setLink(e.target.value)}
        value={user.link}
        placeholder="Enter link"
      />

      <Button filled_color text="Save" onClick={handleUpdateUser} />
    </div>
  );
};

export default PersonalInfo;
