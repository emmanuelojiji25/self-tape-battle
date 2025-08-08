import {
  addDoc,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, storage } from "../firebaseConfig";
import "./Dashboard.scss";
import Button from "../components/Button";
import {
  getDownloadURL,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";

const Dashboard = () => {
  const [view, setView] = useState("battles");

  const [battles, setBattles] = useState([]);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [prize, setPrize] = useState("");
  const [file, setFile] = useState("");
  const [deadline, setDeadline] = useState("");
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

  const id = title.replace(" ", "-").trim().toLowerCase();

  const handleCreateBattle = async () => {
    const collectionRef = doc(db, "battles", id);

    try {
      await setDoc(collectionRef, {
        title: title,
        prize: prize,
        id: id,
        winner: "",
        voters: [],
        battleStatus: "open",
        genre: "",
        file: "",
        deadline: deadline,
      });

      uploadFile();
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFile = async () => {
    try {
      const fileRef = ref(storage, `battle-file/${id}`);
      await uploadBytes(fileRef, file).then(() => {
        getDownloadURL(fileRef).then(async (url) => {
          const docRef = doc(db, "battles", id);

          await updateDoc(docRef, {
            file: url,
          });

          await updateMetadata(fileRef, {
            contentDisposition: "attachment",
          });
        });
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
            <input
              type="text"
              placeholder="Deadline"
              onChange={(e) => setDeadline(e.target.value)}
            ></input>
            <Button
              filled
              text="Create Battle"
              onClick={() => handleCreateBattle()}
            />
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
                console.log(file);
              }}
            ></input>
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
                <p>{battle.battleStatus}</p>
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
