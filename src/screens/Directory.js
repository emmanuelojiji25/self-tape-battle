import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import "./Directory.scss";

const Directory = () => {
  const [actors, setActors] = useState([]);
  const [casting, setCasting] = useState([]);

  const [view, setView] = useState("actors");

  const getUsers = async (role, setter) => {
    try {
      const collectionRef = collection(db, "users");

      const q = query(collectionRef, where("role", "==", role));

      const snapshot = await getDocs(q);

      const data = [];

      snapshot.forEach((doc) => {
        data.push(doc.data());
      });

      setter(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers("actor", setActors);
    getUsers("casting", setCasting);
  });

  return (
    <div className="Directory">
      <h1>Directory</h1>

      <span className="tab">Actors</span>
      <span className="tab">Casting</span>

      {view === "actors" && (
        <div className="actors">
          {actors.map((actor) => (
            <h1>actor</h1>
          ))}
        </div>
      )}

      {view === "casting" && (
        <div className="actors">
          {casting.map((casting) => (
            <h1>actor</h1>
          ))}
        </div>
      )}
    </div>
  );
};

export default Directory;
