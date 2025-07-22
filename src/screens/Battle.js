import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EntryCard from "../components/EntryCard";
import { db } from "../firebaseConfig";

const Battle = () => {
  const [title, setTitle] = useState("");
  const [entries, setEntries] = useState([]);

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

  useEffect(() => {
    getBattle();
  }, []);
  return (
    <div className="Battle">
      <Link to="/">Back</Link>
      <h1>{title}</h1>
      <button>Join Battle</button>

      {entries.map((entry) => {
        return <EntryCard src={entry.url} uid={entry.uid} />;
      })}
    </div>
  );
};

export default Battle;
