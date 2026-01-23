import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  increment,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebaseConfig";
import "./EntryCard.scss";
import ConfettiExplosion from "react-confetti-explosion";
import { Link } from "react-router-dom";
import ShareModal from "./ShareModal";
import DeleteModal from "./DeleteModal";
import ReportModal from "./ReportModal";

const EntryCard = ({
  url,
  uid,
  battleId,
  voteButtonVisible,
  battleStatus,
  isPillVisible,
}) => {
  const { loggedInUser } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [votes, setVotes] = useState(0);
  const [userhasVoted, setUserHasVoted] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [username, setUsername] = useState("");

  const [headshot, setHeadshot] = useState("");

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [videoClicked, setVideoClicked] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(e.target)
      ) {
        setMenuVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch entry owner's name and username
        const userDoc = await getDoc(doc(db, "users", uid));
        const userData = userDoc.data();
        if (userData) {
          setName(`${userData.firstName} ${userData.lastName}`);
          setUsername(userData.username);

          setHeadshot(userData.headshot);
        }

        // Fetch votes
        const entryRef = doc(db, "battles", battleId, "entries", uid);
        const entrySnap = await getDoc(entryRef);
        const data = entrySnap.data();
        const voteList = data?.votes || [];

        setVotes(voteList.length);
        if (loggedInUser) {
          setUserHasVoted(voteList.includes(loggedInUser.uid));
        }

        // Optional: You can also fetch battle status here if needed
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [uid, battleId, loggedInUser]);

  const handleVote = async () => {
    if (!userhasVoted) {
      try {
        const entryRef = doc(db, "battles", battleId, "entries", uid);

        await updateDoc(entryRef, {
          votes: arrayUnion(loggedInUser.uid),
        });

        onSnapshot(entryRef, (snapshot) => {
          const updatedVotes = snapshot.data().votes || [];
          setVotes(updatedVotes.length);
        });

        await updateDoc(doc(db, "battles", battleId), {
          voters: arrayUnion(loggedInUser.uid),
        });

        const userRef = doc(db, "users", loggedInUser.uid);
        const userSnap = await getDoc(userRef);

        await updateDoc(userRef, {
          coins: increment(1),
          totalCoinsEarned: increment(1),
        });

        await updateDoc(userRef, {
          withdrawals: arrayUnion({
            amount: 1,
            complete: true,
            uid: loggedInUser.uid,
            direction: "inbound",
          }),
        });

        setIsExploding(true);
        setUserHasVoted(true);
      } catch (error) {
        console.error("Voting error:", error);
      }
    }
  };

  const handleDeleteEntry = async () => {
    try {
      const docRef = doc(db, "battles", battleId, "entries", uid);
      await deleteDoc(docRef);
      console.log("deleted");
      setDeleteModalVisible(false);
    } catch (error) {
      console.log(error);
    }
  };

  const videoRef = useRef(null);

  return (
    <div className="EntryCard">
      {shareModalVisible && (
        <ShareModal
          battleId={battleId}
          uid={uid}
          username={username}
          setShareModalVisible={setShareModalVisible}
        />
      )}

      {deleteModalVisible && (
        <DeleteModal
          cancel={() => setDeleteModalVisible(false)}
          deleteEntry={() => handleDeleteEntry()}
        />
      )}

      {isReportModalVisible && (
        <ReportModal
          uid={uid}
          battleId={battleId}
          setIsReportModalVisible={setIsReportModalVisible}
          url={url}
        />
      )}

      {isExploding && <ConfettiExplosion />}

      <div className="entry-card-header">
        <div className="entry-card-header-left">
          <Link to={`/profile/${username}`} className="name">
            {name}
          </Link>
          {uid === loggedInUser?.uid && isPillVisible && (
            <div className="pill">Your entry!</div>
          )}
        </div>

        <div className="entry-card-header-right">
          <div className="user-actions">
            {loggedInUser && voteButtonVisible && battleStatus === "open" && (
              <span
                onClick={() => handleVote()}
                className={`vote-button ${userhasVoted ? "voted" : ""}`}
              >
                {!userhasVoted ? "Vote" : "You voted!"}
              </span>
            )}
            {((loggedInUser && uid === loggedInUser.uid) ||
              battleStatus === "closed") && (
              <span className="votes">
                {votes > 0 ? votes : "No"} Vote{votes < 1 && "s"}
              </span>
            )}
          </div>

          <div className="card-menu-container">
            <div
              className="card-menu-icon"
              onClick={() => setMenuVisible(!menuVisible)}
              ref={menuButtonRef}
            >
              <i class="fa-solid fa-ellipsis"></i>
            </div>
            {menuVisible && (
              <div className="card-menu" ref={menuRef}>
                {uid === loggedInUser?.uid && (
                  <>
                    <span
                      className="share"
                      onClick={() => {
                        setShareModalVisible(true);
                      }}
                    >
                      Share
                    </span>

                    <p
                      onClick={() => setDeleteModalVisible(true)}
                      className="delete"
                    >
                      Delete
                    </p>
                  </>
                )}
                <p onClick={() => setIsReportModalVisible(true)}>Report</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="video-container">
        <video
          ref={videoRef}
          poster={headshot}
          preload="metadata" // loads only minimal info
          controls
          src={url}
        />
      </div>
    </div>
  );
};

export default EntryCard;
