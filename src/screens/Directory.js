import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ActorCard from "../components/ActorCard";
import NavBar from "../components/NavBar";
import { db } from "../firebaseConfig";
import "./Directory.scss";

const PAGE_SIZE = 20;

const Directory = () => {
  const [actors, setActors] = useState([]);
  const [casting, setCasting] = useState([]);

  const [actorsLastDoc, setActorsLastDoc] = useState(null);
  const [castingLastDoc, setCastingLastDoc] = useState(null);

  const [loading, setLoading] = useState(false);
  const [hasMoreActors, setHasMoreActors] = useState(true);
  const [hasMoreCasting, setHasMoreCasting] = useState(true);

  const [view, setView] = useState("actors");

  const getUsers = async (role, state, setState, lastDoc, setLast, setHasMore) => {
    if (loading) return;
    setLoading(true);

    try {
      const collectionRef = collection(db, "users");

      let q = query(
        collectionRef,
        where("role", "==", role),
        where("isOnboardingComplete", "==", true),
        orderBy("uid"),
        limit(PAGE_SIZE)
      );

      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());

      // check if more data exists
      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      if (data.length > 0) {
        setState((prev) => {
          const newData = data.filter(
            (item) => !prev.some((p) => p.uid === item.uid)
          );
          return [...prev, ...newData];
        });

        setLast(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  // initial + tab switch fetch
  useEffect(() => {
    if (view === "actors") {
      setActors([]);
      setActorsLastDoc(null);
      setHasMoreActors(true);

      getUsers(
        "actor",
        actors,
        setActors,
        null,
        setActorsLastDoc,
        setHasMoreActors
      );
    } else {
      setCasting([]);
      setCastingLastDoc(null);
      setHasMoreCasting(true);

      getUsers(
        "professional",
        casting,
        setCasting,
        null,
        setCastingLastDoc,
        setHasMoreCasting
      );
    }
  }, [view]);

  const loadMore = () => {
    if (view === "actors" && hasMoreActors) {
      getUsers(
        "actor",
        actors,
        setActors,
        actorsLastDoc,
        setActorsLastDoc,
        setHasMoreActors
      );
    }

    if (view === "casting" && hasMoreCasting) {
      getUsers(
        "professional",
        casting,
        setCasting,
        castingLastDoc,
        setCastingLastDoc,
        setHasMoreCasting
      );
    }
  };

  return (
    <div className="Directory screen-width">
      <h1>Residents</h1>

      <span
        className={`tab ${view === "actors" ? "active" : ""}`}
        onClick={() => setView("actors")}
      >
        Actors
      </span>

      <span
        className={`tab ${view === "casting" ? "active" : ""}`}
        onClick={() => setView("casting")}
      >
        Professionals
      </span>

      {view === "actors" && (
        <div className="actors">
          {actors.map((actor) => (
            <ActorCard key={actor.uid} uid={actor.uid} size="80" />
          ))}

          {hasMoreActors && (
            <button onClick={loadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      )}

      {view === "casting" && (
        <div className="actors">
          {casting.length === 0 && !loading && (
            <p>You'll see some familiar faces here, check back soon!</p>
          )}

          {casting.map((c) => (
            <ActorCard key={c.uid} uid={c.uid} />
          ))}

          {hasMoreCasting && (
            <button onClick={loadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Directory;