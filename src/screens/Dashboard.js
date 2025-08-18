import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
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
  const [view, setView] = useState("requests");

  const [battles, setBattles] = useState([]);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [prize, setPrize] = useState("");
  const [file, setFile] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState({}); // keyed by uid

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

  const getRequests = async () => {
    try {
      const collectionRef = collectionGroup(db, "transactions");
      const q = query(collectionRef, where("status", "==", "pending"));
      const docs = await getDocs(q);

      const docsData = [];

      docs.forEach((doc) => {
        docsData.push(doc.data());
        console.log();
      });

      setRequests(docsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const result = {};

      for (const r of requests) {
        const snap = await getDoc(doc(db, "users", r.uid));
        if (snap.exists()) {
          result[r.uid] = snap.data();
        }
      }

      setUsers(result);
    };

    fetchUsers();
  }, [requests]);

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
        status: "open",
        genre: genre,
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

  const handleCompleteTransaction = async (uid, id) => {
    try {
      const docRef = doc(db, "users", uid, "transactions", id);

      await updateDoc(docRef, {
        status: "complete",
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBattles();
    getRequests();
  }, []);
  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>

      <div className="menu">
        <h3>Battles</h3>
        <h3>Users</h3>
        <h3>Requests</h3>
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
            <input
              type="text"
              placeholder="Genre"
              onChange={(e) => setGenre(e.target.value)}
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
                <p>{battle.status}</p>
                <Button
                  filled
                  text={battle.active ? "Close Battle" : "Open Battle"}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {view === "requests" && (
        <>
          {requests.map((request) => {
            return (
              <>
                <h3>{users[request.uid]?.username ?? "Loading…"}</h3>
                <h4>{request.amount} coins</h4>
                <Button
                  filled
                  text="Complete"
                  onClick={() =>
                    handleCompleteTransaction(request.uid, request.id)
                  }
                />
              </>
            );
          })}
        </>
      )}
    </div>
  );
};

export default Dashboard;
