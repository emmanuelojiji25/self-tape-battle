import "./PersonalInfo.scss";

const PersonalInfo = () => {
  const handleUpdateUser = async () => {
    const updates = {};
    try {
      const docRef = doc(db, "users", user.userId);

      if (user.username.trim().toLowerCase() !== originalUser.username) {
        updates.username = user.username.trim().toLowerCase();
      }

      if (user.bio.trim() !== originalUser.bio) {
        updates.bio = user.bio.trim();
      }

      if (user.link.trim() !== originalUser.link) {
        updates.webLink =
          user.link.includes("https://") || user.link.includes("http://")
            ? user.link.trim()
            : `https://${user.link}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="edit-profile-section">
      <h2>Your details</h2>
      <div className="headshot-container">
        <div
          className="headshot"
          style={{
            backgroundImage: `url(${previewFile ? previewFile : headshot})`,
          }}
        ></div>

        <p onClick={() => inputRef.current.click()} className="highlight">
          Change headshot
        </p>
      </div>
      <input
        type="file"
        style={{ display: "none" }}
        ref={inputRef}
        onChange={(e) => {
          const newFile = e.target.files;
          if (newFile && newFile[0]) {
            setFile(newFile[0]);
            const preview = window.URL.createObjectURL(newFile[0]);
            setPreviewfile(preview);
          }
        }}
        accept="image/jpeg, image/png"
      ></input>
      <Input type="text" value={firstName} disabled />
      <Input type="text" value={lastName} disabled />
      <Input
        type="text"
        onChange={(e) => {
          setUsername(e.target.value);
          setShowUsernameMessage(true);
        }}
        value={username}
      />
      {showUsernameMessage && (
        <span style={{ color: "white" }}>
          {isUsernameAvailable ? "Available" : "Not available"}
        </span>
      )}

      <Input
        type="text"
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        placeholder="Enter bio"
      />
      <Input
        type="text"
        onChange={(e) => setLink(e.target.value)}
        value={link}
        placeholder="Enter link"
      />
    </div>
  );
};

export default PersonalInfo;
