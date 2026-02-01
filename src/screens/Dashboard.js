import {
  addDoc,
  collection,
  collectionGroup,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import "./Dashboard.scss";
import Button from "../components/Button";
import {
  getDownloadURL,
  ref,
  updateMetadata,
  uploadBytes,
} from "firebase/storage";
import emailjs from "@emailjs/browser";
import { sendEmailVerification, updateProfile } from "firebase/auth";

const Dashboard = () => {
  const [view, setView] = useState("battles");

  const [battles, setBattles] = useState([]);

  const [outstandingUsers, setOutstandingUsers] = useState();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [prize, setPrize] = useState(null);
  const [file, setFile] = useState("");
  const [deadline, setDeadline] = useState("");
  const [visibility, setVisibility] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [requests, setRequests] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState({}); // keyed by uid

  const [mailingUsers, setMailingUsers] = useState(0);

  const [type, setType] = useState("");

  const [winner, setWinner] = useState("");

  const [locked, setLocked] = useState(true);

  const code = "stb_26121999";

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
        prize: {
          type: type,
          value: type === "coins" ? Number(prize) : prize,
        },
        id: id,
        winner: "",
        voters: [],
        status: "open",
        genre: genre,
        file: "",
        deadline: deadline,
        visibility: visibility,
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
    const battleRef = doc(db, "battles", battleId);
    try {
      const collectionRef = collection(db, "battles", battleId, "entries");
      const snapshot = await getDocs(collectionRef);

      // Get Winner

      const entriesRef = collection(db, "battles", battleId, "entries");

      const q = query(
        entriesRef,
        orderBy("voteCount", "desc"),
        orderBy("date", "asc")
      );

      const querySnapshot = await getDocs(q);
      const winnerEntry = querySnapshot.docs[0].data();
      const winnerUid = winnerEntry.uid;

      const winnerRef = doc(db, "users", winnerUid);

      const winnerSnapshot = await getDoc(winnerRef);
      const winnerData = winnerSnapshot.data();

      // Award Prize to winner
      const battleSnapshot = await getDoc(battleRef);
      const battleData = battleSnapshot.data();

      const prizeObject = battleData.prize;

      emailjs.init({
        publicKey: "vDAbvtQ-t4ao0CqWi",
      });

      if (prizeObject.type === "coins") {
        await updateDoc(winnerRef, {
          coins: increment(prizeObject.value),
          totalCoinsEarned: increment(prizeObject.value),
        });

        // Award coin to all voters of winning entry
        const votesRef = collection(
          db,
          "battles",
          battleId,
          "entries",
          winnerUid,
          "votes"
        );
        const votesSnapshot = await getDocs(votesRef);

        const voteDocs = votesSnapshot.docs.map((doc) => doc.data());

        await Promise.all(
          voteDocs.map(async (voter) => {
            const voterRef = doc(db, "users", voter.uid);

            updateDoc(voterRef, {
              coins: increment(1),
              totalCoinsEarned: increment(1),
            });

            const voterSnapshot = await getDoc(voterRef);

            const { firstName, email } = voterSnapshot.data();

            const userInfo = {
              name: firstName,
              email: email,
              link: `https://app.selftapebattle.com/arena/${battleId}`,
            };

            // Send email to voters who voted for winning entry
            emailjs.send("service_v3a3sw5", "template_1ulp8a8", userInfo);
          })
        );
      }

      await updateDoc(battleRef, {
        winner: winnerUid,
        status: "closed",
      });

      // Send email to winner
      const info = {
        name: winnerData.firstName,
        email: winnerData.email,
        battleName: battleData.title,
        prize: `${prizeObject.value} ${
          typeof prizeObject.value === "number" && "coins"
        }`,
      };

      emailjs.send("service_v3a3sw5", "template_65k4u6r", info);
    } catch (error) {
      console.error("Error in getWinner:", error);
    }
  };

  const handleChangeView = (view) => {
    setView(view);
  };

  const getMailingUsers = async () => {
    try {
      const ref = collection(db, "mailing");

      const snapshot = await getDocs(ref);

      const docs = [];

      snapshot.forEach((doc) => {
        docs.push(doc.data());
      });

      setMailingUsers(docs);

      console.log(doc);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMailingUsers();
  }, []);

  useEffect(() => {
    const getOutstandingUsers = async () => {
      const collectionRef = collection(db, "users");
      const q = query(
        collectionRef,
        where("isOnboardingComplete", "==", false)
      );

      const snapshot = await getDocs(q);

      const docs = [];

      snapshot.forEach((doc) => {
        docs.push(doc.data());
      });
      setOutstandingUsers(docs);
      try {
      } catch (error) {
        console.log(error);
      }
    };

    getOutstandingUsers();
  });

  const handleManualVerify = async (uid) => {
    try {
      await updateProfile(uid, {
        email: "test.com",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const convertVotes = async () => {
    const entriesRef = collection(db, "battles", "test-battle", "entries");
    const entriesSnapshot = await getDocs(entriesRef);

    entriesSnapshot.docs.map((entry) => {
      if (entry.data().votes) {
        try {
          entry.data().votes.map(async (voter) => {
            const docRef = doc(
              db,
              "battles",
              "test-battle",
              "entries",
              entry.data().uid,
              "votes",
              voter
            );
            await setDoc(docRef, {
              uid: voter,
              battleId: "test-battle",
            });

            const entryRef = doc(
              db,
              "battles",
              "test-battle",
              "entries",
              entry.data().uid
            );
            await updateDoc(entryRef, {
              votes: deleteField(),
            });
            console.log("complete");
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <div className="Dashboard">
      {locked ? (
        <div className="dashboard-locked">
          <h2>Please enter password</h2>
          <input
            type="text"
            placeholder="Password"
            onChange={(e) => {
              if (e.target.value === code) {
                setLocked(false);
              }
            }}
          ></input>
        </div>
      ) : (
        <>
          <h1>Dashboard</h1>
          <h1 onClick={() => convertVotes()}>Convert</h1>

          <div className="menu">
            <h3 onClick={() => handleChangeView("battles")}>Battles</h3>
            <h3 onClick={() => handleChangeView("users")}>Users</h3>
            <h3 onClick={() => handleChangeView("requests")}>Requests</h3>
            <h3 onClick={() => handleChangeView("reports")}>Reports</h3>
            <h3 onClick={() => handleChangeView("mailing")}>Mailing</h3>
            <h3 onClick={() => handleChangeView("action-required")}>
              Action required
            </h3>
          </div>

          {isModalVisible && (
            <div className="create-battle-modal-container">
              <div className="create-battle-modal">
                <input
                  type="text"
                  placeholder="Title"
                  onChange={(e) => setTitle(e.target.value)}
                ></input>
                <label>Coins</label>
                <input
                  type="radio"
                  name="type"
                  value="coins"
                  onChange={(e) => setType("coins")}
                />
                <label>Custom</label>
                <input
                  type="radio"
                  name="type"
                  value="custom"
                  onChange={(e) => setType("custom")}
                ></input>

                <input
                  type="text"
                  placeholder="prize"
                  onChange={(e) => setPrize(e.target.value)}
                />
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
                <p>Visibility</p>
                <label>Published</label>
                <input
                  type="radio"
                  name="visibility"
                  value="coins"
                  onChange={(e) => setVisibility("published")}
                />
                <label>Drafts</label>
                <input
                  type="radio"
                  name="visibility"
                  value="coins"
                  onChange={(e) => setVisibility("draft")}
                />

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
                    <p>{battle.prize.type}</p>
                    <p>{battle.prize.value}</p>

                    <p>{battle.status}</p>
                    <Button
                      filled
                      text={
                        battle.status === "open"
                          ? "Close Battle"
                          : "Open Battle"
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
                  <video
                    src={report.url}
                    controls
                    className="dashboard-video-report"
                  />
                </>
              ))}
            </>
          )}

          {view === "mailing" && (
            <>
              <h1>Mailing</h1>
              <h1>{mailingUsers.length} Signups</h1>
              {mailingUsers.map((user) => (
                <p>{user.email}</p>
              ))}
            </>
          )}

          {view === "action-required" && (
            <>
              <Button
                filled_color
                text="Resend verification"
                onClick={() => {
                  outstandingUsers.forEach(async (user) => {
                    await sendEmailVerification(user.email);
                  });
                }}
              />
              {outstandingUsers.map((user) => (
                <>
                  <h1>{user.email}</h1>
                  <Button
                    filled_color
                    text="Verify Email"
                    onClick={() => handleManualVerify()}
                  />
                </>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
