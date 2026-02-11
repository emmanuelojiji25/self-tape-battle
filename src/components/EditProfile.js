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

const EditProfile = ({ setEditProfileVisible, originalUser, user }) => {
  const { loggedInUser } = useContext(AuthContext);

  const [view, setView] = useState("bank_info");

  const registry = {
    personal_info: <PersonalInfo user={user} />,
    contact_info: <ContactInfo user={user} />,
    bank_info: <BankInfo user={user} />,
  };

  const handleUpdateUser = async () => {
    const updates = {};
    try {
      if (user.settings.publicProfile !== originalUser.PublicProfile) {
        updates.settings = { publicProfile: user.settings.publicProfile };
      }

      if (user.contactEmail != originalUser.contactEmail) {
        updates.contactEmail = user.contactEmail.trim();
      }

      if (user.contactNumber != originalUser.contactNumber) {
        updates.contactNumber = user.contactNumber.trim();
      }

      if (user.accountName != originalUser.accountName) {
        updates.accountName = user.accountName.trim();
      }

      if (user.accountNumber != originalUser.accountNumber) {
        updates.accountNumber = user.accountNumber.trim();
      }

      if (user.sortCode != originalUser.sortCode) {
        updates.sortCode = user.accountNumber.trim();
      }

      if (updates.length === 0) {
        console.log("no changes");
      } else {
        try {
          await updateDoc(docRef, updates);
          await updateHeadshot();
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }

      console.log("complete!");
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
