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
import { auth, db, storage } from "../firebaseConfig";
import { AuthContext } from "../contexts/AuthContext";
import EntryCard from "../components/EntryCard";
import Button from "../components/Button";
import NavBar from "../components/NavBar";
import LockedProfile from "../components/LockedProfile";
import Wallet from "../components/Wallet";
import ActorCard from "../components/ActorCard";
import Loader from "../components/Loader";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ff from "../media/ff.svg";
import MessageModal from "../components/MessageModal";
import EditProfile from "../components/EditProfile";

const Profile = () => {
  const params = useParams();

  const { loggedInUser, authRole } = useContext(AuthContext);

  const [user, setUser] = useState({});
  const [originalUser, setOriginalUser] = useState(null);

  const [contactEmail, setContactEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");

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

      setUser(data);

      setOriginalUser({
        username: data.username,
        lastName: data.firstName,
        bio: data.bio,
        link: data.webLink,
        headshot: data.headshot,
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
      const q = query(battlesCollection, where("uid", "==", user.uid));
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
      const q = query(collectionRef, where("winner", "==", user.uid));
      const docs = await getDocs(q);
      console.log(docs.docs[0])
      setBattlesWon(docs.size);
    } catch (error) {
      console.log(error);
    }
  };

  const getTotalVotes = async () => {
    try {
      const collectionRef = collectionGroup(db, "entries");
      const q = query(collectionRef, where("uid", "==", user.uid));

      const snapshot = await getDocs(q);

      const votes = snapshot.docs.map(
        (doc) => Number(doc.data().voteCount) || 0
      );

      const sum = votes.reduce((total, current) => total + current, 0);

      setTotalVotes(sum);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [params.username]);

  useEffect(() => {
    if (user.uid) {
      getUserBattles();
      getBattlesWon();
      getTotalVotes();
    }
  }, [user.uid]);

  const [isEditProfileVisible, setEditProfileVisible] = useState(false);

  const handleCopyInfo = async (text) => {
    clearTimeout();

    await navigator.clipboard.writeText(text);
    setIsInfoCopied(true);

    setTimeout(() => {
      setIsInfoCopied(false);
    }, 2000);
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

  return (
    <div className="Profile screen-width">
      {isInfoCopied && <div className="contact-tooltip">Copied!</div>}
      {walletVisible && <Wallet />}
      {showMessageModal && (
        <MessageModal
          title="Founding Fighter"
          text={`${user.firstName} was one of the first 250 fighters to join the arena!`}
          onClick={() => setShowMessageModal(false)}
          buttonText="Close"
          icon={<img src={ff} />}
        />
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
          {!user.settings.publicProfile && !loggedInUser ? (
            <LockedProfile firstName={user.firstName} />
          ) : (
            <>
              {!user.uid && <h1>User doesn't exist</h1>}
              <div className="profile-header">
                <div className="profile-headshot-container">
                  <img className="profile-headshot" src={user.headshot} />
                </div>
                <div className="profile-info">
                  <div className="name-badge-container">
                    <h1>{user.firstName}</h1>
                    {user.badges.includes("founding_fighter") && (
                      <img
                        src={ff}
                        className="badge"
                        onClick={() => setShowMessageModal(true)}
                      />
                    )}
                  </div>
                  <span className="username">{user.username}</span>

                  <span>{user.bio}</span>
                  <a href={`${user.link}`} target="_" className="web-link">
                    {link}
                  </a>
                  <div class="profile-button-container">
                    {user.role === "actor" && (
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
                    {user.uid === loggedInUser?.uid &&
                      user.role === "professional" && (
                        <Button
                          filled
                          text="My bookmarks"
                          onClick={() => setEditProfileVisible(true)}
                        ></Button>
                      )}

                    {authRole === "professional" && user.role === "actor" && (
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

                    {user.uid === loggedInUser?.uid && (
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

              {user.role === "actor" && (
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

              {user.role === "actor" && (
                <div className="entries-container">
                  {battles.map((battle) => (
                    <>
                      {
                        <EntryCard
                          url={battle.url}
                          uid={battle.uid}
                          battleId={battle.battleId}
                          userData={{
                            firstName: user.firstName,
                            lastName: user.lastName,
                            username: user.username,
                            headshot: user.headshot,
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
                <EditProfile
                  originalUser={originalUser}
                  user={user}
                  setUser={setUser}
                  setEditProfileVisible={setEditProfileVisible}
                />
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
