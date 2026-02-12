import "./EditProfile.scss";
import { doc, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useContext, useRef, useState } from "react";
import { db, storage } from "../firebaseConfig";
import BackButton from "./BackButton";
import Button from "./Button";
import "./EditProfile.scss";
import { AuthContext } from "../contexts/AuthContext.js";
import Input from "../components/Input.js";
import PersonalInfo from "./PersonalInfo";
import ContactInfo from "./ContactInfo";
import BankInfo from "./BankInfo";

const EditProfile = ({
  setEditProfileVisible,
  originalUser,
  user,
  setUser,
}) => {
  const { loggedInUser } = useContext(AuthContext);

  const [view, setView] = useState("bank_info");

  const registry = {
    personal_info: (
      <PersonalInfo
        user={user}
        setUser={setUser}
        setEditProfileVisible={setEditProfileVisible}
        originalUser={originalUser}
      />
    ),
    contact_info: (
      <ContactInfo
        user={user}
        setUser={setUser}
        setEditProfileVisible={setEditProfileVisible}
        originalUser={originalUser}
      />
    ),
    bank_info: (
      <BankInfo
        user={user}
        setUser={setUser}
        setEditProfileVisible={setEditProfileVisible}
        originalUser={originalUser}
      />
    ),
  };

  const changeView = (view) => {
    setView(view);
  };

  return (
    <div className="EditProfile">
      <div className="edit-profile-inner">
        <BackButton onClick={() => setEditProfileVisible(false)} />
        <h1>Edit profile</h1>
        <div className="tab-container">
          <h4 onClick={() => changeView("personal_info")}>Personal</h4>
          <h4 onClick={() => changeView("contact_info")}>Contact</h4>
          <h4 onClick={() => changeView("bank_info")}>Bank</h4>
        </div>
        {registry[view]}
      </div>
    </div>
  );
};

export default EditProfile;
