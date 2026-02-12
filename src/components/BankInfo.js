import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Input from "./Input";

const BankInfo = ({ user, setUser, originalUser }) => {
  const updateField = (e, field) => {
    setUser({
      ...user,
      [field]: e.target.value,
    });
    console.log(); 
  };

  const handleUpdateUser = async () => {
    const updates = {}

    const docRef = doc(db, "users", user.uid)

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
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="edit-profile-section">
      <h2>Bank details</h2>
      <Input
        type="text"
        placeholder="Account name"
        value={user.accountName}
        onChange={(e) => updateField(e, "accountName")}
      />
      <Input
        type="text"
        placeholder="Account number"
        value={user.accountNumber}
        onChange={(e) => updateField(e, "accountNumber")}
      />
      <Input
        type="text"
        placeholder="Sort code"
        value={user.sortCode}
        onChange={(e) => updateField(e, "sortCode")}
      />
      <Button text="Save" filled_color onClick={handleUpdateUser} />
    </div>
  );
};

export default BankInfo;
