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
import EntryCard from "../components/EntryCard";
import { AuthContext } from "../contexts/AuthContext";
import { db, storage } from "../firebaseConfig";

const Battle = () => {
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);

  const { loggedInUser } = useContext(AuthContext);

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
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="Battle">
      <Link to="/">Back</Link>
      <h1>{title}</h1>
      <button onClick={() => inputRef.current.click()}>Join Battle</button>
      {file && <button onClick={() => handleUploadBattle()}>Upload</button>}

      {file && <span>{file.name}</span>}
      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files;
          setFile(file[0]);
        }}
      ></input>

      {entries.map((entry) => {
        return <EntryCard src={entry.url} uid={entry.uid} />;
      })}
    </div>
  );
};

export default Battle;
