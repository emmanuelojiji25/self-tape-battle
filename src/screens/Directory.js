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

  const [loading, setLoading] = useState(false);

  const [view, setView] = useState("actors");

  const [cities, setCities] = useState([
    { name: "birmingham", selected: false },
    { name: "london", selected: false },
    { name: "liverpool", selected: false },
    { name: "manchester", selected: false },
  ]);

  const getUsers = async (role, setter) => {
    if (loading) return;
    setLoading(true);

    try {
      const collectionRef = collection(db, "users");

      const q = query(
        collectionRef,
        where("role", "==", role),
        where("isOnboardingComplete", "==", true),
        ...(selectedCities.length > 0
          ? [where("location", "in", selectedCities)]
          : []),
        orderBy("uid"),
        limit(PAGE_SIZE)
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());

      setter(data);
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    getUsers("actor", setActors);
    getUsers("professional", setCasting);
  }, [cities]);

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

  const selectedCities = cities
    .filter((city) => city.selected)
    .map((city) => city.name);

  useEffect(() => {
    console.log(selectedCities);
  }, [cities]);

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
        </div>
      )}

      <NavBar />
    </div>
  );
};

export default Directory;
