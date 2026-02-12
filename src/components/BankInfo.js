import Button from "./Button";
import Input from "./Input";

const BankInfo = ({ user }) => {
  const handleUpdateUser = async () => {
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
  };

  return (
    <div className="edit-profile-section">
      <h2>Bank details</h2>
      <Input
        type="text"
        placeholder="Account name"
        value={user.accountName}
        onChange={(e) => setAccountName(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Account number"
        value={user.accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
      />
      <Input
        type="text"
        placeholder="Sort code"
        value={user.sortCode}
        onChange={(e) => setSortCode(e.target.value)}
      />
      <Button text="Save" filled_color />
    </div>
  );
};

export default BankInfo;
