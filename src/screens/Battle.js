import {
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import { AuthContext } from "../contexts/AuthContext";
import icon_download from "../media/download.svg";
import { db, storage } from "../firebaseConfig";
import "./Battle.scss";
import NavBar from "../components/NavBar";
import MessageModal from "../components/MessageModal";
import Skeleton from "../components/Skeleton";
import chest from "../media/chest.svg";
import BackButton from "../components/BackButton";
import { Coin } from "../components/Icon";
import HowToPlay from "../components/HowToPlay";

const Battle = () => {
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [prize, setPrize] = useState("");
  const [genre, setGenre] = useState("");
  const [voters, setVoters] = useState([]);

  const [loading, setLoading] = useState(true);

  const [winner, setWinner] = useState("");

  const { loggedInUser } = useContext(AuthContext);

  const { battleId } = useParams();

  const [battleStatus, setBattleStatus] = useState("");

  const [battleAttachment, setBattleAttachment] = useState("");

  const [userHasVoted, setUserHasVoted] = useState(null);

  const [errorMessage, setErrorMessage] = useState("");

  const [showMessageModal, setShowMessageModal] = useState(false);

  const [userEntry, setUserEntry] = useState(null);

  const [howToPlayVisible, setHowToPlayVisible] = useState(false);

  const [usersCache, setUsersCache] = useState({});

  const [userVotes, setUserVotes] = useState(0);

  const [loggedInUserDoc, setLoggedInUserDoc] = useState({});

  useEffect(() => {
    getUser();
    getBattle();
    getWinner();
    getUserEntry();
  }, []);

  useEffect(() => {
    console.log(usersCache);
  }, [usersCache]);

  const getUser = async () => {
    const userRef = doc(db, "users", loggedInUser.uid);
    const snapshot = await getDoc(userRef);
    setLoggedInUserDoc(snapshot.data());
  };

  const getBattle = async () => {
    try {
      const docRef = doc(db, "battles", battleId);
      const entriesRef = collection(db, "battles", battleId, "entries");

      const q = query(entriesRef, orderBy("date", "asc"));

      const entriesDocs = await getDocs(q);

      const battleSnapshot = await getDoc(docRef);

      const data = battleSnapshot.data();

      if (data) {
        setTitle(data.title);
        setBattleStatus(data.status);
        setBattleAttachment(data.file);
        setDeadline(data.deadline);
        setPrize(data.prize.value);
        setGenre(data.genre);
        setVoters(data.voters);
      }

      let entries = [];

      entriesDocs.forEach((doc) => {
        entries.push(doc.data());
      });

      const filtered = entries.filter((e) => e.uid !== loggedInUser.uid);
      setEntries(filtered);
      await fetchUsersForEntries(filtered);

      // Vote limit query
      const votesRef = collectionGroup(db, "votes");

      const votesQuery = query(
        votesRef,
        where("uid", "==", loggedInUser.uid),
        where("battleId", "==", battleId)
      );

      onSnapshot(votesRef, async () => {
        const votesQuerySnapshot = await getDocs(votesQuery);
        setUserVotes(votesQuerySnapshot.docs.length);
      });

      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsersForEntries = async (entriesData) => {
    if (entriesData.length === 0) return;

    const uniqueUids = [...new Set(entriesData.map((e) => e.uid))];

    // Only fetch users we don't have cached yet
    const uncachedUids = uniqueUids.filter((uid) => !usersCache[uid]);

    if (uncachedUids.length === 0) return;

    const userPromises = uncachedUids.map((uid) =>
      getDoc(doc(db, "users", uid))
    );

    const userDocs = await Promise.all(userPromises);

    // Create an object keyed by uid
    const newCache = { ...usersCache };

    userDocs.forEach((userDoc, index) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        newCache[uncachedUids[index]] = {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          headshot: data.headshot,
        };
      }
    });

    setUsersCache(newCache);
  };

  const getUserEntry = () => {
    const entryRef = doc(db, "battles", battleId, "entries", loggedInUser.uid);

    if (entryRef) {
      try {
        onSnapshot(entryRef, (snapshot) => {
          setUserEntry(snapshot.data());
        });
      } catch (error) {}
    }
  };

  const getWinner = async () => {
    try {
      const battleRef = doc(db, "battles", battleId);

      const snapshot = await getDoc(battleRef);

      const winner = snapshot.data().winner;

      const userRef = doc(db, "users", winner);
      const userSnapshot = await getDoc(userRef);

      setWinner(userSnapshot.data());
    } catch (error) {
      console.log(error);
    }
  };

  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  const [uploadStatus, setUploadStatus] = useState("");

  const handleUploadBattle = async () => {
    const storageRef = ref(storage, `battles/${battleId}/${loggedInUser.uid}`);

    setUploadStatus("uploading");

    try {
      await uploadBytes(storageRef, file, { contentType: file.type }).then(
        () => {
          getDownloadURL(
            ref(storage, `battles/${battleId}/${loggedInUser.uid}`)
          ).then(async (url) => {
            const docRef = doc(
              db,
              "battles",
              battleId,
              "entries",
              loggedInUser.uid
            );
            await setDoc(docRef, {
              uid: `${loggedInUser.uid}`,
              url: `${url}`,
              voteCount: 0,
              date: Date.now(),
              shareSetting: "private",
              battleId: battleId,
            });

            const userRef = doc(db, "users", loggedInUser.uid);

            await updateDoc(userRef, {
              coins: increment(1),
              totalCoinsEarned: increment(5),
              battlesEntered: increment(1),
            });

            await updateDoc(userRef, {
              withdrawals: arrayUnion({
                amount: 1,
                complete: true,
                uid: loggedInUser.uid,
                direction: "inbound",
              }),
            });
          });
        }
      );
      setUploadStatus("complete");
      setShowMessageModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  /*useEffect(() => {
    const checkWinner = async () => {
      const battleRef = doc(db, "battles", battleId);
      try {
        const collectionRef = collection(db, "battles", battleId, "entries");
        const snapshot = await getDocs(collectionRef);

        const entries = snapshot.docs.map((d) => d.data());

        if (!entries.length) {
          console.warn("No entries found for this battle.");
          setWinner(null);
          return;
        }

        // Helper function to normalize date types
        const toMillis = (date) => {
          if (!date) return 0;
          if (typeof date === "number") return date; // from Date.now()
          if (date.seconds) return date.seconds * 1000; // from Firestore Timestamp
          if (typeof date.toMillis === "function") return date.toMillis();
          return 0;
        };

        // 🔥 Sort once by votes desc, then date asc (earliest wins tie)
        entries.sort((a, b) => {
          const votesA = a.votes?.length || 0;
          const votesB = b.votes?.length || 0;

          if (votesB !== votesA) return votesB - votesA; // Most votes first
          return toMillis(a.date) - toMillis(b.date); // Earlier entry wins ties
        });

        const winnerEntry = entries[0];

        console.log(winnerEntry);
        if (!winnerEntry?.uid) {
          console.warn("No valid winner UID found in entries.");
          setWinner(null);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    };
    checkWinner();
  });*/

  return (
    <div className="Battle screen-width">
      {errorMessage && (
        <MessageModal
          onClick={() => setErrorMessage("")}
          title="Hang on!"
          text={errorMessage}
          buttonText="Okay, got it!"
        />
      )}

      {showMessageModal && (
        <MessageModal
          confetti
          onClick={() => setShowMessageModal(false)}
          title="Nice work!"
          text="5 coins earned"
          buttonText="Close"
          icon={<Coin width="100" />}
        />
      )}
      {howToPlayVisible && (
        <>
          <div className="battle-how-to-play-container">
            <BackButton onClick={() => setHowToPlayVisible(false)} />
            <HowToPlay />
          </div>
        </>
      )}
      <Link to="/" className="back">
        <BackButton />
      </Link>
      <div className="battle-header">
        <div className="battle-header-left">
          {loading ? (
            <Skeleton height={35} />
          ) : (
            <h3 className="battle-title">{title}</h3>
          )}
          {loading ? (
            <Skeleton height={100} />
          ) : (
            <div className="battle-info">
              <span className="prize-container">
                {typeof prize === "string" ? (
                  <img src={chest} />
                ) : (
                  <Coin width="30" />
                )}
                {prize}
              </span>
              <span className="info-pill">
                <i class="fa-solid fa-masks-theater"></i>
                {genre}
              </span>
              <span className="info-pill">
                <i class="fa-solid fa-calendar"></i>
                {deadline}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="button-container">
        {!userEntry &&
          !file &&
          loading === false &&
          battleStatus === "open" && (
            <Button
              onClick={() => {
                if (userVotes === 0 && entries.length > 4) {
                  console.log("You must vote first!");
                  setErrorMessage(
                    "You must watch & vote for at least 1 entry before you can join this battle. You can still vote for other entries in this battle."
                  );
                  return;
                } else {
                  inputRef.current.click();
                }
              }}
              text="Upload Tape"
              className="upload-tape"
              filled_color
            />
          )}

        <a href={`${battleAttachment}`} download target="_blank">
          <Button text="Download Monologue" outline />
        </a>
        <Button
          text="How to play"
          icon={<i class="fa-solid fa-circle-info"></i>}
          onClick={() => setHowToPlayVisible(true)}
          outline
        />
        <p className="user-votes">
          Votes Remaining: <strong>{5 - userVotes}</strong>
        </p>
      </div>
      {file && (
        <div className="file-container">
          {uploadStatus === "uploading" && (
            <span className="uploading">
              Uploading..larger videos may take a bit longer..
            </span>
          )}
          {uploadStatus === "" && (
            <>
              <p className="file-name">{file.name}</p>
              <div className="button-container">
                <Button
                  onClick={() => handleUploadBattle()}
                  text="Post"
                  filled
                />
                <Button onClick={() => setFile(null)} text="Cancel" outline />
              </div>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files;
          setFile(file[0]);
        }}
        accept=".mov, .mp4"
      ></input>

      {winner && battleStatus === "closed" && (
        <div className="winner">
          <div
            className="winner-avatar"
            style={{ backgroundImage: `url(${winner.headshot})` }}
          ></div>
          <div className="winner-right">
            <span>WINNER</span>
            {winner.firstName + " " + winner.lastName}
          </div>
        </div>
      )}

      <div className="entries-container">
        {userEntry && (
          <EntryCard
            url={userEntry.url}
            uid={userEntry.uid}
            battleId={battleId}
            voteButtonVisible={userEntry.uid != loggedInUser.uid}
            battleStatus={battleStatus}
            isPillVisible={true}
            userData={loggedInUserDoc} // Changed from userDocs to usersCache
            userVotes={userVotes}
            preload="auto"
            menu
          />
        )}

        {entries.map((entry) => {
          return (
            <EntryCard
              key={entry?.uid} // Add key!
              url={entry?.url}
              uid={entry?.uid}
              battleId={battleId}
              voteButtonVisible={entry?.uid != loggedInUser.uid}
              battleStatus={battleStatus}
              userData={usersCache[entry.uid]} // Changed from userDocs to usersCache
              userVotes={userVotes}
              poster={usersCache[entry.uid]?.headshot}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Battle;
