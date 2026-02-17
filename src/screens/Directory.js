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
import Button from "../components/Button";
import Dropdown from "../components/Dropdown";
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

  const getUsers = async (role, setter, lastDoc, setLast, setHasMore) => {
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

      if (lastDoc) q = query(q, startAfter(lastDoc));

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());

      if (data.length < PAGE_SIZE) setHasMore(false);

      if (data.length > 0) {
        setter((prev) => [...prev, ...data]);
        setLast(snapshot.docs[snapshot.docs.length - 1]);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    getUsers("actor", setActors, null, setActorsLastDoc, setHasMoreActors);
    getUsers(
      "professional",
      setCasting,
      null,
      setCastingLastDoc,
      setHasMoreCasting
    );
  }, []);

  const loadMore = () => {
    if (view === "actors" && hasMoreActors) {
      getUsers(
        "actor",
        setActors,
        actorsLastDoc,
        setActorsLastDoc,
        setHasMoreActors
      );
    }
    if (view === "casting" && hasMoreCasting) {
      getUsers(
        "professional",
        setCasting,
        castingLastDoc,
        setCastingLastDoc,
        setHasMoreCasting
      );
    }
  };

  const [cities, setCities] = useState([
    { name: "birmingham", selected: false },
    { name: "london", selected: false },
    { name: "liverpool", selected: false },
    { name: "manchester", selected: false },
  ]);

  const [filtersVisible, setFiltersVisible] = useState(false);

  const [search, setSearch] = useState("");

  const filteredCities = cities.filter((city) =>
    city.name.includes(search.trim().toLowerCase())
  );

  const chosenArray = search ? filteredCities : cities;

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const selectCity = (name) => {
    setCities((prev) =>
      prev.map((city) =>
        city.name === name ? { ...city, selected: !city.selected } : city
      )
    );
  };

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
          <h4
            onClick={() => {
              setFiltersVisible(!filtersVisible);
            }}
          >
            {filtersVisible ? "Hide" : "Show"} filters
          </h4>

          {filtersVisible && (
            <Dropdown
              options={chosenArray.map((city) => (
                <div className="option">
                  <h4>{city.name}</h4>
                  <div
                    className={`checkbox ${city.selected && "selected"}`}
                    onClick={() => selectCity(city.name)}
                  ></div>
                </div>
              ))}
              onChange={(e) => handleInputChange(e)}
            />
          )}

          {actors.map((actor, i) => (
            <ActorCard key={i} uid={actor.uid} />
          ))}
          {hasMoreActors && (
            <Button
              filled_color
              onClick={loadMore}
              disabled={loading}
              text="Load More"
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      )}

      {view === "casting" && (
        <div className="actors">
          {casting.length === 0 && (
            <p>You'll see some familiar faces here, check back soon!</p>
          )}
          {casting.map((c) => (
            <ActorCard key={c.uid} uid={c.uid} />
          ))}
          {hasMoreCasting && (
            <Button filled_color onClick={loadMore} disabled={loading}>
              {loading ? "Loading..." : "Load More"}
            </Button>
          )}
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Directory;
