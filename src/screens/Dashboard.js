import { addDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import "./Dashboard.scss";
import Button from "../components/Button";

const Dashboard = () => {
  const [view, setView] = useState("battles");

  const [battles, setBattles] = useState([]);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [prize, setPrize] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  const getBattles = async () => {
    try {
      const collectionRef = collection(db, "battles");

      const docs = await getDocs(collectionRef);
      const data = [];
      docs.forEach((doc) => {
        data.push(doc.data());
      });
      setBattles(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateBattle = async () => {
    const collectionRef = collection(db, "battles");

    const id = title.replace(" ", "-").trim().toLowerCase();
    try {
      await addDoc(collectionRef, {
        title: title,
        prize: prize,
        id: id,
        winner: "",
        voters: [],
        active: true,
        genre: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBattles();
  }, []);
  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>

      <div className="menu">
        <h3>Battles</h3>
        <h3>Users</h3>
      </div>

      {isModalVisible && (
        <div className="create-battle-modal-container">
          <div className="create-battle-modal">
            <input
              type="text"
              placeholder="Title"
              onChange={(e) => setTitle(e.target.value)}
            ></input>
            <input
              type="text"
              placeholder="Prize"
              onChange={(e) => setPrize(e.target.value)}
            ></input>
            <Button
              filled
              text="Create Battle"
              onClick={() => handleCreateBattle()}
            />
            <Button
              outline
              text="Cancel"
              onClick={() => setIsModalVisible(false)}
            />
          </div>
        </div>
      )}

      {view === "battles" && (
        <>
          <h2>Battles</h2>
          <Button
            filled
            text="New Battle"
            onClick={() => setIsModalVisible(true)}
          />
          <div className="battles-container">
            {battles.map((battle) => (
              <div className="admin-battle-card">
                <h3>{battle.title}</h3>
                <p>{battle.id}</p>
                <p>{battle.prize}</p>
                <p>{battle.active ? "active" : "closed"}</p>
                <Button
                  filled
                  text={battle.active ? "Close Battle" : "Open Battle"}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
