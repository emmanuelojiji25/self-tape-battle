import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Input from "./Input";

const StatsInfo = ({ user, setUser, originalUser }) => {
  const [cities, setCities] = useState([
    { name: "birmingham", selected: false },
    { name: "london", selected: false },
    { name: "liverpool", selected: false },
    { name: "manchester", selected: false },
  ]);

  useEffect(() => {
    if (!user) return; // wait until data loads

    setCities((prev) =>
      prev.map((city) => ({
        ...city,
        selected: user.stats["location"].includes(city.name),
      }))
    );
  }, [user]); // runs whenever userData changes

  const selectedCities = cities
    .filter((city) => city.selected)
    .map((city) => city.name);

  useEffect(() => {
    console.log(selectedCities);
  }, [cities]);

  const handleUpdateUser = async () => {
    const updates = {
      stats: {},
    };

    const docRef = doc(db, "users", user.uid);

    updates.stats["location"] = selectedCities;

    if (updates.length === 0) {
      console.log("no changes");
    } else {
      try {
        await updateDoc(docRef, updates);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="edit-profile-section">
      <h2>Stats</h2>
      <p>Casting directors will be able to find you using these details.</p>
      <Dropdown label="Gender" />
      <Dropdown
        label={originalUser.stats["location"].map((location) => (
          <p>{location}</p>
        ))}
        data={cities}
        setData={setCities}
      />

      <Button text="Save" filled_color onClick={handleUpdateUser} />
    </div>
  );
};

export default StatsInfo;
