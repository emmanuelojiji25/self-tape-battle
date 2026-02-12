import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import BackButton from "./BackButton";
import Button from "./Button";
import Input from "./Input";

const ContactInfo = ({
  user,
  setUser,
  setEditProfileVisible,
  originalUser,
}) => {
  const updateField = (e, field) => {
    setUser({
      ...user,
      [field]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    const updates = {};
    try {
      if (user.contactEmail != originalUser.contactEmail) {
        updates.contactEmail = user.contactEmail.trim();
      }

      if (user.contactNumber != originalUser.contactNumber) {
        updates.contactNumber = user.contactNumber.trim();
      }

      if (updates !== originalUser) {
        try {
          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, updates);
          console.log("User updated!");
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="ContactInfo">
      <div className="edit-profile-section">
        <h2>Professional contact</h2>
        <p>
          This information will only be visible to casting directors. You can
          put your agent's details here too. If you do not complete this,
          casting directors may not be able to contact you.
        </p>
        <Input
          type="text"
          value={user.contactEmail}
          placeholder="Email"
          onChange={(e) => {
            updateField(e, "contactEmail");
          }}
        />
        <Input
          type="text"
          value={user.contactNumber}
          placeholder="Phone number"
          onChange={(e) => {
            updateField(e, "contactNumber");
          }}
        />
      </div>

      <div className="button-container">
        <Button filled_color text="Save" onClick={() => handleUpdateUser()} />
      </div>
    </div>
  );
};

export default ContactInfo;
