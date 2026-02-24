import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import Button from "./Button";
import Dropdown from "./Dropdown";
import Input from "./Input";

const CITIES = ["birmingham", "london", "liverpool", "manchester"];
const GENDERS = ["male", "female", "other"];

const toOptions = (names, selectedValues, multi = false) =>
  names.map((name) => ({
    name,
    selected: multi ? selectedValues.includes(name) : selectedValues === name,
  }));

const StatsInfo = ({ user, setUser, originalUser, setEditProfileVisible }) => {
  const [cities, setCities] = useState(toOptions(CITIES, [], true));
  const [gender, setGender] = useState(toOptions(GENDERS, ""));
  const [minPlayingAge, setMinPlayingAge] = useState(user.stats.minPlayingAge);
  const [maxPlayingAge, setMaxPlayingAge] = useState(user.stats.maxPlayingAge);

  useEffect(() => {
    if (!user) return;
    setCities(toOptions(CITIES, user.stats.location, true));
    setGender(toOptions(GENDERS, user.stats.gender));
  }, [user]);

  const selectedCities = cities.filter((c) => c.selected).map((c) => c.name);
  const selectedGender =
    gender.find((g) => g.selected)?.name ?? "Choose gender";

  const handleUpdateUser = async () => {
    const updates = {
      stats: {
        location: selectedCities,
        gender: selectedGender,
        minPlayingAge,
        maxPlayingAge,
      },
    };

    try {
      await updateDoc(doc(db, "users", user.uid), updates);
   
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="edit-profile-section">
      <h2>Stats</h2>
      <p>Casting directors will be able to find you using these details.</p>

      <Input
        type="number"
        placeholder="Min playing age"
        value={minPlayingAge}
        onChange={(e) => setMinPlayingAge(Number(e.target.value))}
      />
      <Input
        type="number"
        placeholder="Max playing age"
        value={maxPlayingAge}
        onChange={(e) => setMaxPlayingAge(Number(e.target.value))}
      />
      <Dropdown
        label={selectedGender}
        data={gender}
        setData={setGender}
        type="single"
      />
      <Dropdown
        label={originalUser.stats.location.map((loc) => (
          <p key={loc}>{loc}</p>
        ))}
        data={cities}
        setData={setCities}
        type="multi"
      />

      <Button text="Save" filled_color onClick={handleUpdateUser} />
    </div>
  );
};

export default StatsInfo;
