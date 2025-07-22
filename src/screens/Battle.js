import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";

const Battle = () => {
  const [title, setTitle] = useState("");

  const { battleId } = useParams();
  const getBattle = async () => {
    const docRef = doc(db, "battles", battleId);

    const snapshot = await getDoc(docRef);

    const data = snapshot.data();
    setTitle(data.title);

    try {
    } catch (error) {}
  };

  useEffect(() => {
    getBattle();
  }, []);
  return (
    <div className="Battle">
      <h1>{title}</h1>
    </div>
  );
};

export default Battle;
