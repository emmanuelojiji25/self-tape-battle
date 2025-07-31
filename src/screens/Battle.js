import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import { AuthContext } from "../contexts/AuthContext";
import icon_download from "../media/download.svg";
import { db, storage } from "../firebaseConfig";
import "./Battle.scss";

const Battle = () => {
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);

  const { loggedInUser } = useContext(AuthContext);

  const userHasJoined = entries.some((entry) => entry.uid === loggedInUser.uid);

  //const userHasJoined = false;

  const { battleId } = useParams();

  const getBattle = async () => {
    const docRef = doc(db, "battles", battleId);
    const entriesRef = collection(db, "battles", battleId, "entries");

    const snapshot = await getDoc(docRef);
    const entriesDocs = await getDocs(entriesRef);

    const data = snapshot.data();
    setTitle(data.title);

    let entries = [];

    entriesDocs.forEach((doc) => {
      entries.push(doc.data());
    });

    setEntries(entries);
    console.log(entries);

    try {
    } catch (error) {}
  };

  const inputRef = useRef(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    getBattle();
  }, []);

  const handleUploadBattle = async () => {
    const storageRef = ref(storage, `battles/${battleId}/${loggedInUser.uid}`);

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
          console.log("complete!");
        });
      });
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

        <a
          href="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/960px-Cat_November_2010-1a.jpg"
          download
        >
          <div className="download">
            <img src={icon_download}/>
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
          <p className="file-name">{file.name}</p>
          <div className="button-container">
            <Button onClick={() => handleUploadBattle()} text="Post" filled />
            <Button onClick={() => setFile(null)} text="Cancel" outline />
          </div>
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

      <div className="entries-container">
        {entries.map((entry) => {
          return (
            <EntryCard
              url={entry.url}
              uid={entry.uid}
              battleId={battleId}
              voteButtonVisible={entry.uid != loggedInUser.uid}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Battle;
