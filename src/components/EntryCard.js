import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";

const EntryCard = ({ url, firstname, lastname, uid }) => {
  const [name, setName] = useState("");

  const getName = async () => {
    const docRef = doc(db, "users", uid);
    const docSnapshot = await getDoc(docRef);
    const data = docSnapshot.data();
    setName(data.firstName + data.lastName);
  };

  useEffect(() => {
    getName();
  });

  return (
    <div className="EntryCard">
      <h1>Entry card</h1>
      <span>{name}</span>
      <video src={url} />
    </div>
  );
};

export default EntryCard;
