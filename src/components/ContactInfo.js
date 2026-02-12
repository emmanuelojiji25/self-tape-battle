import BackButton from "./BackButton";
import Button from "./Button";
import Input from "./Input";

const ContactInfo = ({ user, setEditProfileVisible }) => {
  const handleUpdateUser = () => {
    const updates = {};
    try {
      if (user.contactEmail != originalUser.contactEmail) {
        updates.contactEmail = user.contactEmail.trim();
      }

      if (user.contactNumber != originalUser.contactNumber) {
        updates.contactNumber = user.contactNumber.trim();
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
            //setContactEmail(e.target.value);
          }}
        />
        <Input
          type="text"
          value={user.contactNumber}
          placeholder="Phone number"
          onChange={(e) => {
            //setContactNumber(e.target.value);
          }}
        />
      </div>

      

      <div className="button-container">
        <Button filled text="Save" onClick={() => handleUpdateUser()} />

        <Button
          outline
          text="Cancel"
          onClick={() => setEditProfileVisible(false)}
        />
      </div>
    </div>
  );
};

export default ContactInfo;
