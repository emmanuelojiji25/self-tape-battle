import {
  addDoc,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
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
  const [view, setView] = useState("battles");

  const [battles, setBattles] = useState([]);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [prize, setPrize] = useState("");
  const [file, setFile] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState({}); // keyed by uid

  const [winner, setWinner] = useState("");

  const getBattles = () => {
    try {
      const collectionRef = collection(db, "battles");

      // Listen for real-time updates
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBattles(data);
      });

      // Return unsubscribe function so you can stop listening later
      return unsubscribe;
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

  const getReports = async () => {
    const collectionRef = collection(db, "reports");

    try {
      const snapshot = await getDocs(collectionRef);

      const data = [];

      snapshot.forEach((doc) => {
        data.push(doc.data());
        setReports(data);
      });
    } catch (error) {}
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

      setIsModalVisible(false);
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

      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, {
        coins: 0,
        withdrawalPending: false,
      });

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
    getReports();
  }, []);

  const closeBattle = async (battleId) => {
    try {
      const collectionRef = collection(db, "battles", battleId, "entries");
      const snapshot = await getDocs(collectionRef);

      const entries = snapshot.docs.map((d) => d.data());

      if (!entries.length) {
        console.warn("No entries found for this battle.");
        setWinner(null);
        return;
      }

      // Helper function to normalize date types
      const toMillis = (date) => {
        if (!date) return 0;
        if (typeof date === "number") return date; // from Date.now()
        if (date.seconds) return date.seconds * 1000; // from Firestore Timestamp
        if (typeof date.toMillis === "function") return date.toMillis();
        return 0;
      };

      // 🔥 Sort once by votes desc, then date asc (earliest wins tie)
      entries.sort((a, b) => {
        const votesA = a.votes?.length || 0;
        const votesB = b.votes?.length || 0;

        if (votesB !== votesA) return votesB - votesA; // Most votes first
        return toMillis(a.date) - toMillis(b.date); // Earlier entry wins ties
      });

      const winnerEntry = entries[0];
      if (!winnerEntry?.uid) {
        console.warn("No valid winner UID found in entries.");
        setWinner(null);
        return;
      }

      const winnerDoc = await getDoc(doc(db, "users", winnerEntry.uid));
      if (!winnerDoc.exists()) {
        console.warn("Winner user document not found:", winnerEntry.uid);
        setWinner(null);
        return;
      }

      const winnerData = winnerDoc.data();
      setWinner(winnerData);

      console.log(
        "🏆 Winner:",
        winnerEntry.uid,
        "Votes:",
        winnerEntry.votes?.length || 0
      );

      // Close battle

      const battleRef = doc(db, "battles", battleId);

      await updateDoc(battleRef, {
        winner: winnerEntry.uid,
        status: "closed",
      });
    } catch (error) {
      console.error("Error in getWinner:", error);
    }
  };

  const handleChangeView = (view) => {
    setView(view);
  };

  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>

      <div className="menu">
        <h3 onClick={() => handleChangeView("battles")}>Battles</h3>
        <h3 onClick={() => handleChangeView("users")}>Users</h3>
        <h3 onClick={() => handleChangeView("requests")}>Requests</h3>
        <h3 onClick={() => handleChangeView("reports")}>Reports</h3>
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
                  text={
                    battle.status === "open" ? "Close Battle" : "Open Battle"
                  }
                  onClick={async () => {
                    const docRef = doc(db, "battles", battle.id);
                    if (battle.status === "open") {
                      closeBattle(battle.id);
                    } else {
                      await updateDoc(docRef, {
                        status: "open",
                      });
                    }
                  }}
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

      {view === "reports" && (
        <>
          {reports.map((report) => (
            <>
              <h4>Battle ID: {report.battleId}</h4>
              <h4>UID: {report.uid}</h4>
              <p>Reason: {report.reason}</p>
              <video src={report.url} controls className="dashboard-video-report" />
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;
