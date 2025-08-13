import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import ActorCard from "../components/ActorCard";
import NavBar from "../components/NavBar";
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
    <div className="Directory screen-width">
      <h1>Directory</h1>

      <span
        className={`tab ${view === "actors" && "active"}`}
        onClick={() => setView("actors")}
      >
        Actors
      </span>
      <span
        className={`tab ${view === "casting" && "active"}`}
        onClick={() => setView("casting")}
      >
        Casting
      </span>

      {view === "actors" && (
        <div className="actors">
          {actors.map((actor) => (
            <ActorCard
              name={actor.firstName + " " + actor.lastName}
              username={actor.username}
              bio={actor.bio}
              headshot={actor.headshot}
              uid={actor.uid}
            />
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
      <NavBar />
    </div>
  );
};

export default Directory;
