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

      const q = query(
        collectionRef,
        where("role", "==", role),
        where("isOnboardingComplete", "==", true)
      );

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
    getUsers("professional", setCasting);
  },[]);

  return (
    <div className="Directory screen-width">
      <h1>Residents</h1>

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
        Casting & Agents
      </span>

      {view === "actors" && (
        <div className="actors">
          {actors.map((actor) => (
            <ActorCard uid={actor.uid} />
          ))}
        </div>
      )}

      {view === "casting" && (
        <div className="actors">
          <p>You'll see some familiar faces here, check back soon!</p>
          {casting.map((casting) => (
            <ActorCard uid={casting.uid} />
          ))}
        </div>
      )}
      <NavBar />
    </div>
  );
};

export default Directory;
