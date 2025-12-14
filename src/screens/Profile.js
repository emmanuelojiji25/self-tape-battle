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
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BattleCard from "../components/BattleCard";
import { auth, db } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import EntryCard from "../components/EntryCard";
import Button from "../components/Button";
import Input from "../components/Input";
import NavBar from "../components/NavBar";
import LockedProfile from "../components/LockedProfile";
import Wallet from "../components/Wallet";
import ActorCard from "../components/ActorCard";

const Profile = () => {
  const params = useParams();

  const navigate = useNavigate();

  const { loggedInUser, authRole } = useContext(AuthContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [publicProfile, setPublicProfile] = useState(false);
  const [role, setRole] = useState("");

  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const [battles, setBattles] = useState([]);

  const [bio, setBio] = useState("");
  const [link, setLink] = useState("");
  const [headshot, setHeadshot] = useState("");

  const [battlesWon, setBattlesWon] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  const [walletVisible, setWalletVisible] = useState(false);

  const [contactInfoVisible, setContactInfoVisible] = useState(false);
  const [isContactInfoCopied, setIsContactInfoCopied] = useState(false);

  const [bookmarks, setBookmarks] = useState([]);

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
      setBio(data.bio || "");
      setLink(data.webLink || "");
      setHeadshot(data.headshot || "");
      setPublicProfile(data.settings?.publicProfile || false);
      setRole(data.role || "");
      setContactNumber(data.contactNumber);
      setContactEmail(data.contactEmail);

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

  const handleCopyProfile = async () => {
    try {
      await navigator.clipboard.writeText(
        `http://localhost:3000/profile/${params.username}`
      );
      console.log(navigator.clipboard.readText());
    } catch (error) {
      console.log(error);
    }
  };

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

  const [isEditPrfofileVisible, setIsEditProfileVisible] = useState(false);

  const handleCopyInfo = async (text) => {
    clearTimeout();

    await navigator.clipboard.writeText(text);
    setIsContactInfoCopied(true);

    setTimeout(() => {
      setIsContactInfoCopied(false);
    }, 2000);
  };

  const handleUpdateUser = async () => {
    try {
      const docRef = doc(db, "users", userId);

      await updateDoc(docRef, {
        username: username.trim().toLowerCase(),
        bio: bio.trim().toLowerCase(),
        webLink: link.trim().toLowerCase(),
        settings: { publicProfile: publicProfile },
        contactEmail: contactEmail,
        contactNumber: contactNumber,
      });

      setIsEditProfileVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetBookmarks = async () => {
    const bookmarksRef = collection(db, "users", loggedInUser.uid, "bookmarks");

    try {
      const docsSnapshot = await getDocs(bookmarksRef);
      const docs = [];

      docsSnapshot.forEach((doc) => {
        docs.push(doc.data());
        setBookmarks(docs);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!loggedInUser) return;
    handleGetBookmarks();
  }, [loggedInUser]);

  return (
    <div className="Profile screen-width">
      {walletVisible && <Wallet />}
      {!publicProfile && !loggedInUser ? (
        <LockedProfile firstName={firstName} />
      ) : (
        <>
          <div className="profile-header">
            <div className="profile-headshot-container">
              <img className="profile-headshot" src={headshot} />
            </div>
            <div className="profile-info">
              <h1>{name}</h1>
              <span>{username}</span>
              <span>{bio}</span>
              <a href={link} target="_" className="web-link">
                {link}
              </a>

              <div class="profile-button-container">
                {role === "actor" && (
                  <Button
                    filled
                    text="Share Card"
                    onClick={() => handleCopyProfile()}
                  ></Button>
                )}
                {userId === loggedInUser.uid && role === "professional" && (
                  <Button
                    filled
                    text="My bookmarks"
                    onClick={() => setIsEditProfileVisible(true)}
                  ></Button>
                )}

                {authRole === "professional" && role === "actor" && (
                  <>
                    <Button
                      filled
                      text="Contact"
                      onClick={() => setContactInfoVisible(!contactInfoVisible)}
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

                        {isContactInfoCopied && (
                          <div className="contact-tooltip">Copied!</div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {userId === loggedInUser?.uid && (
                  <>
                    <Button
                      outline
                      text="Edit Profile"
                      onClick={() => setIsEditProfileVisible(true)}
                    ></Button>

                    {/* <Button
                      outline
                      text="Sign Out"
                      onClick={() => {
                        auth.signOut();
                        localStorage.clear();
                        navigate("/userAuth");
                      }}
                    ></Button>*/}
                  </>
                )}
              </div>
            </div>
          </div>

          {role === "actor" && (
            <div className="stat-card-container">
              <div className="stat-card">
                <h2>{battles.length}</h2>
                <p>Battles Entered</p>
              </div>
              <div className="stat-card">
                <h2>{battlesWon}</h2>
                <hp>Battles Won</hp>
              </div>
              <div className="stat-card">
                <h2>{totalVotes}</h2>
                <p>Total votes</p>
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
                    />
                  }
                </>
              ))}
            </div>
          )}

          {role === "professional" && (
            <div className="bookmarks">
              <h2>Bookmarks</h2>
              {bookmarks.map((actor) => (
                <ActorCard uid={actor.uid} />
              ))}
            </div>
          )}

          {isEditPrfofileVisible && (
            <div className="edit-profile">
              <div className="edit-profile-inner screen-width">
                <div className="edit-profile-section">
                  <h2>Your details</h2>
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
                  />
                </div>

                <div className="edit-profile-section">
                  <h2>Professional contact</h2>
                  <p>
                    This information will only be visible to casting directors.
                    You can put your agent's details here too. If you do not
                    complete this, casting directors may not be able to contact
                    you.
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
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      e.target.checked
                        ? setPublicProfile(true)
                        : setPublicProfile(false)
                    }
                  ></input>
                  <span>Public Profile</span>
                  {publicProfile && <p>Share your profile: </p>}
                </div>

                <Button filled text="Save" onClick={() => handleUpdateUser()} />

                <Button
                  outline
                  text="Cancel"
                  onClick={() => setIsEditProfileVisible(false)}
                />
              </div>
            </div>
          )}
          <NavBar />
        </>
      )}
    </div>
  );
};

export default Profile;
