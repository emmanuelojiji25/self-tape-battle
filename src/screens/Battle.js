import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  setDoc,
  updateDoc,
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
import coin from "../media/stb_coin.svg";
import Skeleton from "../components/Skeleton";
import chest from "../media/chest.svg";
import BackButton from "../components/BackButton";
import Coin from "../components/Coin";

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

  useEffect(() => {
    getBattle();
    getWinner();
    getUserEntry();
  }, []);

  const getBattle = async () => {
    const docRef = doc(db, "battles", battleId);
    const entriesRef = collection(db, "battles", battleId, "entries");

    const entriesDocs = await getDocs(entriesRef);
    onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      setTitle(data.title);
      setBattleStatus(data.status);
      setBattleAttachment(data.file);
      setDeadline(data.deadline);
      setUserHasVoted(data.voters.includes(loggedInUser.uid));
      setPrize(data.prize.value);
      setGenre(data.genre);
      setVoters(data.voters);
    });

    let entries = [];

    entriesDocs.forEach((doc) => {
      entries.push(doc.data());
    });

    setEntries(entries.filter((entry) => entry.uid != loggedInUser.uid));

    setTimeout(() => {
      setLoading(false);
    }, 300);

    try {
    } catch (error) {}
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
      await uploadBytes(storageRef, file).then(() => {
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
            votes: [],
            date: Date.now(),
            shareSetting: "private",
            battleId: battleId,
          });

          const userRef = doc(db, "users", loggedInUser.uid);

          await updateDoc(userRef, {
            coins: increment(1),
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
      });
      setUploadStatus("complete");
      setShowMessageModal(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="Battle screen-width">
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
                {typeof prize === "string" ? <img src={chest} /> : <Coin width="30" />}
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
                if (!userHasVoted && voters.length > 5) {
                  console.log("You must vote first!");
                  setErrorMessage(
                    "You must vote for at least 1 entry before you can join this battle"
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
      </div>
      {file && (
        <div className="file-container">
          {uploadStatus === "uploading" && (
            <span className="uploading">Uploading..</span>
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
            menu
          />
        )}

        {entries.map((entry) => {
          return (
            <EntryCard
              url={entry.url}
              uid={entry.uid}
              battleId={battleId}
              voteButtonVisible={entry.uid != loggedInUser.uid}
              battleStatus={battleStatus}
            />
          );
        })}
      </div>
      <NavBar />
    </div>
  );
};

export default Battle;
