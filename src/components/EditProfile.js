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
import StatsInfo from "./StatsInfo";

const EditProfile = ({
  setEditProfileVisible,
  originalUser,
  user,
  setUser,
}) => {
  const { loggedInUser } = useContext(AuthContext);

  const [view, setView] = useState("personal_info");

  const sections = [
    {
      id: "personal_info",
      label: "Personal",
      component: (
        <PersonalInfo
          user={user}
          setUser={setUser}
          setEditProfileVisible={setEditProfileVisible}
          originalUser={originalUser}
        />
      ),
    },
    {
      id: "contact_info",
      label: "Contact",
      component: (
        <ContactInfo
          user={user}
          setUser={setUser}
          setEditProfileVisible={setEditProfileVisible}
          originalUser={originalUser}
        />
      ),
    },
    {
      id: "stats_info",
      label: "Stats",
      component: (
        <StatsInfo
          user={user}
          setUser={setUser}
          setEditProfileVisible={setEditProfileVisible}
          originalUser={originalUser}
        />
      ),
    },
    {
      id: "bank_info",
      label: "Bank",
      component: (
        <BankInfo
          user={user}
          setUser={setUser}
          setEditProfileVisible={setEditProfileVisible}
          originalUser={originalUser}
        />
      ),
    },
  ];

  const changeView = (view) => {
    setView(view);
  };

  return (
    <div className="EditProfile">
      <div className="edit-profile-inner">
        <BackButton onClick={() => setEditProfileVisible(false)} />
        <h1>Edit profile</h1>

        <div className="tab-container">
          {sections.map((section) => (
            <h4
              onClick={() => changeView(section.id)}
              className={section.id === view && "focus"}
            >
              {section.label}
            </h4>
          ))}
        </div>
        {sections.find((section) => section.id === view).component}
      </div>
    </div>
  );
};

export default EditProfile;
