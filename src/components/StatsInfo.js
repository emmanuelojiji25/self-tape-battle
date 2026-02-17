import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Input from "./Input";

const StatsInfo = ({ user, setUser, originalUser }) => {
  const updateField = (e, field) => {
    setUser({
      ...user,
      [field]: e.target.value,
    });
    console.log();
  };

  const handleUpdateUser = async () => {
    const updates = {};

    const docRef = doc(db, "users", user.uid);

    if (user.accountName != originalUser.accountName) {
      updates.accountName = user.accountName.trim();
    }

    if (updates.length === 0) {
      console.log("no changes");
    } else {
      try {
        await updateDoc(docRef, updates);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="edit-profile-section">
      <h2>Stats</h2>
      <p>Casting directors will be able to find you using these details.</p>
      <Dropdown label="Gender" />
      <Dropdown label="Location" />

      <Button text="Save" filled_color onClick={handleUpdateUser} />
    </div>
  );
};

export default StatsInfo;
