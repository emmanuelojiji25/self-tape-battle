import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
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

const Battle = () => {
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);

  const [winner, setWinner] = useState();

  const { loggedInUser } = useContext(AuthContext);

  const userHasJoined = entries.some((entry) => entry.uid === loggedInUser.uid);

  const { battleId } = useParams();

  const [battleStatus, setBattleStatus] = useState("");

  const [battleAttachment, setBattleAttachment] = useState("");

  const getBattle = async () => {
    const docRef = doc(db, "battles", battleId);
    const entriesRef = collection(db, "battles", battleId, "entries");

    const snapshot = await getDoc(docRef);
    const entriesDocs = await getDocs(entriesRef);

    const data = snapshot.data();
    setTitle(data.title);
    setBattleStatus(data.battleStatus);
    setBattleAttachment(data.file);

    let entries = [];

    entriesDocs.forEach((doc) => {
      entries.push(doc.data());
    });

    setEntries(entries);

    try {
    } catch (error) {}
  };

  useEffect(() => {
    getBattle();
    getWinner();
  }, []);

  const getWinner = async () => {
    try {
      const collectionRef = collection(db, "battles", battleId, "entries");

      const snapshot = await getDocs(collectionRef);

      const data = [];
      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      const sorted = data.sort(
        (a, b) => (b.votes?.length || 0) - (a.votes?.length || 0)
      );

      const winner = sorted[0].uid;

      const userSnapshot = await getDoc(doc(db, "users", winner));

      setWinner(userSnapshot.data());

      console.log(userSnapshot);
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
          });

          const userRef = doc(db, "users", loggedInUser.uid);
          const snapshot = await getDoc(userRef);
          await updateDoc(userRef, {
            coins: snapshot.data().coins + 1,
          });
          console.log("complete!");
        });
      });
      setUploadStatus("complete");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="Battle screen-width">
      <Link to="/" className="back">
        Back
      </Link>
      <div className="battle-header">
        <div className="battle-header-left">
          <h3 className="battle-title">{title}</h3>
          <span className="prize-pill">Spotlight Membership</span>
          <span className="prize-pill">Horror</span>
        </div>

        <a href={`${battleAttachment}`} download>
          <div className="download">
            <img src={icon_download} />
          </div>
        </a>
      </div>

      {!userHasJoined && !file && (
        <Button
          onClick={() => inputRef.current.click()}
          text="Upload Tape"
          className="upload-tape"
          filled
        />
      )}
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
