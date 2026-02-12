import "./SettingsInfo.scss"


const SettingsInfo = () => {
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
}

export default SettingsInfo;