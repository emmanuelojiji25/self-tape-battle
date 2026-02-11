const ContactInfo = () => {
    return(
      <div className="edit-profile">
      <div className="edit-profile-inner screen-width">
        <BackButton onClick={() => setEditProfileVisible(false)} />

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

        <div className="edit-profile-section">
          <input
            type="checkbox"
            onChange={
              (e) =>
                e.target.checked
                  ? null //setPublicProfile(true)
                  : null //setPublicProfile(false)
            }
            checked={user.publicProfile}
          ></input>
          <span>Public Profile</span>
          {/*publicProfile && <p>Share your profile: </p>*/}
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
    </div>
    )
}

export default ContactInfo;