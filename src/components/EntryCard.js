import {
  arrayUnion,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
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
  userData,
  url,
  uid,
  battleId,
  voteButtonVisible,
  battleStatus,
  isPillVisible,
  userVotes,
}) => {
  const { loggedInUser } = useContext(AuthContext);

  const { firstName = "", lastName = "", username = "" } = userData || {};

  const [votes, setVotes] = useState(0);
  const [userhasVoted, setUserHasVoted] = useState(false);
  const [isExploding, setIsExploding] = useState(false);

  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);

  const [menuVisible, setMenuVisible] = useState(false);

  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const [videoClicked, setVideoClicked] = useState(false);

  const [voteLimitedReached, setVoteLimitReached] = useState(false);

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
        // Fetch amount of votes
        const votesCollection = collection(
          db,
          "battles",
          battleId,
          "entries",
          uid,
          "votes"
        );
        const snapshot = await getDocs(votesCollection);

        onSnapshot(votesCollection, (snapshot) => {
          setVotes(snapshot.size);
        });

        // Check if user has voted for entry
        const q = query(votesCollection, where("uid", "==", loggedInUser.uid));
        const querySnapshot = await getDocs(q);

        setUserHasVoted(querySnapshot.size > 0);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [uid, battleId, loggedInUser]);

  const handleVote = async () => {
    if (!userhasVoted) {
      try {
        // Add user vote
        const voteDoc = doc(
          db,
          "battles",
          battleId,
          "entries",
          uid,
          "votes",
          loggedInUser.uid
        );

        await setDoc(voteDoc, {
          uid: loggedInUser.uid,
          battleId: battleId,
        });

        const entryDoc = doc(db, "battles", battleId, "entries", uid);
        await updateDoc(entryDoc, {
          voteCount: increment(1),
        });

        // Award User coin
        const userRef = doc(db, "users", loggedInUser.uid);

        await updateDoc(userRef, {
          coins: increment(1),
          totalCoinsEarned: increment(1),
        });

        // Update transactions array
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
            {`${firstName} ${lastName}`}
          </Link>
          {uid === loggedInUser?.uid && isPillVisible && (
            <div className="pill">Your entry!</div>
          )}
        </div>

        <div className="entry-card-header-right">
          <div className="user-actions">
            {loggedInUser &&
              voteButtonVisible &&
              battleStatus === "open" &&
              userVotes < 5 && (
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
                {votes > 0 ? votes : "No"} Vote
                {votes > 1 && "s"}
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
          poster={userData?.headshot}
          preload="none" // loads only minimal info
          controls
          src={`${url}.mp4`}
        />
      </div>
    </div>
  );
};

export default EntryCard;
