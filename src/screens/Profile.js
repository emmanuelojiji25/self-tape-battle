import "./Profile.scss";

import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BattleCard from "../components/BattleCard";
import { auth, db, storage } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import EntryCard from "../components/EntryCard";
import Button from "../components/Button";
import Input from "../components/Input";
import NavBar from "../components/NavBar";
import LockedProfile from "../components/LockedProfile";
import Wallet from "../components/Wallet";
import ActorCard from "../components/ActorCard";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ff from "../media/ff.svg";
import MessageModal from "../components/MessageModal";

const Profile = () => {
  const params = useParams();

  const navigate = useNavigate();

  const { loggedInUser, authRole } = useContext(AuthContext);

  const [originalUser, setOriginalUser] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [publicProfile, setPublicProfile] = useState(false);
  const [role, setRole] = useState("");

  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [headshot, setHeadshot] = useState("");

  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [sortCode, setSortCode] = useState("");

  const [badges, setBadges] = useState([]);

  const [battles, setBattles] = useState([]);

  const [battlesEntered, setBattlesEntered] = useState(null);

  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");

  const [battlesWon, setBattlesWon] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  const [walletVisible, setWalletVisible] = useState(false);

  const [contactInfoVisible, setContactInfoVisible] = useState(false);
  const [isInfoCopied, setIsInfoCopied] = useState(false);

  const [bookmarks, setBookmarks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showMessageModal, setShowMessageModal] = useState(false);

  const getUser = async () => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", params.username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.warn("No user found with username:", params.username);
        return;
      }

      const docSnap = querySnapshot.docs[0];
      const data = docSnap.data();

      setUsername(data.username || "");
      setUserId(data.uid || docSnap.id);
      setName(`${data.firstName || ""} ${data.lastName || ""}`.trim());
      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setHeadshot(data.headshot || "");
      setBio(data.bio || "");
      setLink(data.webLink || "");
      setPublicProfile(data.settings.publicProfile || false);
      setRole(data.role || "");
      setContactNumber(data.contactNumber);
      setContactEmail(data.contactEmail);
      setBattlesEntered(data.battlesEntered);
      setBadges(data.badges);

      setOriginalUser({
        username: data.username,
        lastName: data.firstName,
        bio: data.bio,
        link: data.webLink,
        headhsot: data.headshot,
        publicProfile: data.settings.publicProfile,
        contactNumber: data.contactNumber,
        contactEmail: data.contactEmail,
        accountName: data.accountName,
        accountNumber: data.accountNumber,
        sortCode: data.sortCode,
      });

      setTimeout(() => {
        setLoading(false);
      }, 500);

      console.log("Fetched user role:", data.role);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const getUserBattles = async () => {
    try {
      const battlesCollection = collectionGroup(db, "entries");
      const q = query(battlesCollection, where("uid", "==", userId));
      onSnapshot(q, (snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setBattles(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getBattlesWon = async () => {
    try {
      const collectionRef = collection(db, "battles");
      const q = query(collectionRef, where("winner", "==", userId));
      const docs = await getDocs(q);
      setBattlesWon(docs.size);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalVotes = async () => {
    try {
      const collectionRef = collectionGroup(db, "entries");
      const q = query(
        collectionRef,
        where("uid", "==", "3sfGK3I6anY1trjMnan8lbGdGag1")
      );

      const docs = await getDocs(q);

      const votes = [];

      docs.forEach((doc) => {
        votes.push(doc.data().votes.length);
      });

      const calculation = votes.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);

      setTotalVotes(calculation);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [params.username]);

  useEffect(() => {
    getUserBattles();
    getBattlesWon();
    getTotalVotes();
  }, [userId]);

  const [usernameInput, setUsernameInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  useEffect(() => {
    setUsernameInput(username);
  }, [username]);

  const [showUsernameMessage, setShowUsernameMessage] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  useEffect(() => {
    handleUsernameCheck();
  }, [username]);

  const handleUsernameCheck = async () => {
    try {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("username", "==", username.toLowerCase().trim())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length === 0) {
        console.log("Available!");
        setIsUsernameAvailable(true);
      }

      if (querySnapshot.docs.length === 1) {
        console.log("Unavailable!");
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [isEditProfileVisible, setEditProfileVisible] = useState(false);

  const handleCopyInfo = async (text) => {
    clearTimeout();

    await navigator.clipboard.writeText(text);
    setIsInfoCopied(true);

    setTimeout(() => {
      setIsInfoCopied(false);
    }, 2000);
  };

  const handleUpdateUser = async () => {
    const updates = {};
    try {
      const docRef = doc(db, "users", userId);

      if (username.trim().toLowerCase() !== originalUser.username) {
        updates.username = username.trim().toLowerCase();
      }

      if (bio.trim() !== originalUser.bio) {
        updates.bio = bio.trim();
      }

      if (link.trim() !== originalUser.link) {
        updates.webLink =
          link.includes("https://") || link.includes("http://")
            ? link.trim()
            : `https://${link}`;
      }

      if (publicProfile !== originalUser.PublicProfile) {
        updates.settings = { publicProfile: publicProfile };
      }

      if (contactEmail != originalUser.contactEmail) {
        updates.contactEmail = contactEmail.trim();
      }

      if (contactNumber != originalUser.contactNumber) {
        updates.contactNumber = contactNumber.trim();
      }

      if (accountName != originalUser.accountName) {
        updates.accountName = accountName.trim();
      }

      if (accountNumber != originalUser.accountNumber) {
        updates.accountNumber = accountNumber.trim();
      }

      if (sortCode != originalUser.sortCode) {
        updates.sortCode = accountNumber.trim();
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

  useEffect(() => {
    if (!loggedInUser?.uid) return;

    const bookmarksRef = collection(db, "users", loggedInUser.uid, "bookmarks");

    const unsubscribe = onSnapshot(bookmarksRef, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      setBookmarks(docs);
    });

    return () => unsubscribe();
  }, [loggedInUser?.uid]);

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

  return (
    <div className="Profile screen-width">
      {isInfoCopied && <div className="contact-tooltip">Copied!</div>}
      {walletVisible && <Wallet />}
      {showMessageModal && (
        <MessageModal
          title="Founding Fighter"
          text={`${firstName} was one of the first 250 fighters to join the arena!`}
          onClick={() => setShowMessageModal(false)}
          buttonText="Close"
          icon={<img src={ff} />}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          {!publicProfile && !loggedInUser ? (
            <LockedProfile firstName={firstName} />
          ) : (
            <>
              {!userId && <h1>User doesn't exist</h1>}
              <div className="profile-header">
                <div className="profile-headshot-container">
                  <img className="profile-headshot" src={headshot} />
                </div>
                <div className="profile-info">
                  <div className="name-badge-container">
                    <h1>{name}</h1>{" "}
                    {badges.includes("founding_fighter") && (
                      <img
                        src={ff}
                        className="badge"
                        onClick={() => setShowMessageModal(true)}
                      />
                    )}
                  </div>
                  <span className="username">{username}</span>

                  <span>{bio}</span>
                  <a href={`${link}`} target="_" className="web-link">
                    {link}
                  </a>
                  <div class="profile-button-container">
                    {role === "actor" && (
                      <Button
                        filled
                        text="Share Card"
                        onClick={() =>
                          handleCopyInfo(
                            `http://app.selftapebattle.com/profile/${params.username}`
                          )
                        }
                      ></Button>
                    )}
                    {userId === loggedInUser?.uid &&
                      role === "professional" && (
                        <Button
                          filled
                          text="My bookmarks"
                          onClick={() => setEditProfileVisible(true)}
                        ></Button>
                      )}

                    {authRole === "professional" && role === "actor" && (
                      <>
                        <Button
                          filled
                          text="Contact"
                          onClick={() =>
                            setContactInfoVisible(!contactInfoVisible)
                          }
                        ></Button>

                        {contactInfoVisible && (
                          <div className="contact-info">
                            <div>
                              <p>{contactEmail}</p>
                              <p onClick={() => handleCopyInfo(contactEmail)}>
                                Copy
                              </p>
                            </div>

                            <div>
                              <p>{contactNumber}</p>
                              <p onClick={() => handleCopyInfo(contactNumber)}>
                                Copy
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {userId === loggedInUser?.uid && (
                      <>
                        <Button
                          outline
                          text="Edit Profile"
                          onClick={() => setEditProfileVisible(true)}
                        ></Button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {role === "actor" && (
                <div className="stat-card-container">
                  <div className="stat-card">
                    <h2 className="number">{battlesEntered}</h2>
                    <p className="label">Battles Entered</p>
                  </div>
                  <div className="stat-card">
                    <h2>{battlesWon}</h2>
                    <p className="label">Battles Won</p>
                  </div>
                  <div className="stat-card">
                    <h2>{totalVotes}</h2>
                    <p className="label">Total votes</p>
                  </div>
                </div>
              )}

              {role === "actor" && (
                <div className="entries-container">
                  {battles.map((battle) => (
                    <>
                      {
                        <EntryCard
                          url={battle.url}
                          uid={battle.uid}
                          battleId={battle.battleId}
                          userData={{
                            firstName: firstName,
                            lastName: lastName,
                            username: username,
                            headshot: headshot,
                          }}
                          page="profile"
                        />
                      }
                    </>
                  ))}
                </div>
              )}

              {authRole === "professional" && (
                <div className="bookmarks">
                  <h2>Bookmarks</h2>
                  {bookmarks.map((actor) => (
                    <ActorCard uid={actor.uid} />
                  ))}
                </div>
              )}

              {isEditProfileVisible && (
                <div className="edit-profile">
                  <div className="edit-profile-inner screen-width">
                    <BackButton onClick={() => setEditProfileVisible(false)} />
                    <div className="edit-profile-section">
                      <h2>Your details</h2>
                      <div className="headshot-container">
                        <div
                          className="headshot"
                          style={{
                            backgroundImage: `url(${
                              previewFile ? previewFile : headshot
                            })`,
                          }}
                        ></div>

                        <p
                          onClick={() => inputRef.current.click()}
                          className="highlight"
                        >
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
                            const preview = window.URL.createObjectURL(
                              newFile[0]
                            );
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

                    <div className="edit-profile-section">
                      <h2>Professional contact</h2>
                      <p>
                        This information will only be visible to casting
                        directors. You can put your agent's details here too. If
                        you do not complete this, casting directors may not be
                        able to contact you.
                      </p>
                      <Input
                        type="text"
                        value={contactEmail}
                        placeholder="Email"
                        onChange={(e) => {
                          setContactEmail(e.target.value);
                        }}
                      />
                      <Input
                        type="text"
                        value={contactNumber}
                        placeholder="Phone number"
                        onChange={(e) => {
                          setContactNumber(e.target.value);
                        }}
                      />
                    </div>

                    <div className="edit-profile-section">
                      <h2>Bank details</h2>
                      <Input
                        type="text"
                        placeholder="Account name"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                      <Input
                        type="text"
                        placeholder="Sort code"
                        value={sortCode}
                        onChange={(e) => setSortCode(e.target.value)}
                      />
                    </div>

                    <div className="edit-profile-section">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          e.target.checked
                            ? setPublicProfile(true)
                            : setPublicProfile(false)
                        }
                        checked={publicProfile}
                      ></input>
                      <span>Public Profile</span>
                      {/*publicProfile && <p>Share your profile: </p>*/}
                    </div>

                    <div className="button-container">
                      <Button
                        filled
                        text="Save"
                        onClick={() => handleUpdateUser()}
                      />

                      <Button
                        outline
                        text="Cancel"
                        onClick={() => setEditProfileVisible(false)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {loggedInUser && <NavBar />}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
