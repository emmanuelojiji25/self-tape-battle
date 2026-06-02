import {
  arrayUnion,
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/Button";
import EntryCard from "../components/EntryCard";
import { AuthContext } from "../contexts/AuthContext";
import icon_download from "../media/download.svg";
import { db, storage } from "../firebaseConfig";
import "./Battle.scss";
import NavBar from "../components/NavBar";
import MessageModal from "../components/MessageModal";
import Skeleton from "../components/Skeleton";
import chest from "../media/chest.svg";
import BackButton from "../components/BackButton";
import { Coin } from "../components/Icon";
import HowToPlay from "../components/HowToPlay";
import SponsorBanner from "../components/SponsorBanner";

const VIDEO_COMPRESSION_MIME_TYPES = [
  "video/mp4;codecs=h264,aac",
  "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4",
];

const getSupportedRecordingMimeType = () => {
  if (!window.MediaRecorder) return "";

  return (
    VIDEO_COMPRESSION_MIME_TYPES.find((mimeType) =>
      window.MediaRecorder.isTypeSupported(mimeType)
    ) || ""
  );
};

const getExtensionFromMimeType = (mimeType) => {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("webm")) return "webm";
  return "mp4";
};

const getBaseMimeType = (mimeType) => mimeType.split(";")[0];

const getUploadContentType = (file) =>
  getBaseMimeType(file.type || "") || "video/mp4";

const isQuickTimeVideo = (file) =>
  file.type === "video/quicktime" || /\.mov$/i.test(file.name);

const createVideoElement = (file) => {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");

  video.src = url;
  video.preload = "metadata";
  video.playsInline = true;
  video.crossOrigin = "anonymous";

  return { video, url };
};

const assertVideoIsPlayable = (file) =>
  new Promise((resolve, reject) => {
    const { video, url } = createVideoElement(file);

    const cleanup = () => URL.revokeObjectURL(url);

    video.oncanplay = () => {
      cleanup();
      resolve();
    };

    video.onerror = () => {
      cleanup();
      reject(
        new Error(
          "This video format cannot be played in your browser. Please export your tape as an MP4 and upload it again."
        )
      );
    };
  });

const compressVideoFile = async (file) => {
  const mimeType = getSupportedRecordingMimeType();

  if (!mimeType || !window.MediaRecorder) {
    return file;
  }

  const { video, url } = createVideoElement(file);

  try {
    await new Promise((resolve, reject) => {
      video.oncanplay = resolve;
      video.onerror = () =>
        reject(
          new Error(
            "This video format cannot be played in your browser. Please export your tape as an H.264 MP4 and upload it again."
          )
        );
    });

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const maxDimension = 1280;
    const scale = Math.min(
      1,
      maxDimension / Math.max(video.videoWidth, video.videoHeight)
    );

    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));

    if (!context || !canvas.captureStream) {
      return file;
    }

    const stream = canvas.captureStream(30);
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioContext;

    if (AudioContext) {
      audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(video);
      const destination = audioContext.createMediaStreamDestination();

      source.connect(destination);
      destination.stream.getAudioTracks().forEach((track) => {
        stream.addTrack(track);
      });
    }

    const chunks = [];
    const recorder = new MediaRecorder(stream, {
      mimeType,
      audioBitsPerSecond: 96000,
      videoBitsPerSecond: 1800000,
    });

    const recording = new Promise((resolve, reject) => {
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = resolve;
      recorder.onerror = () => reject(recorder.error);
    });

    recorder.start(1000);

    video.currentTime = 0;
    await video.play();

    const drawFrame = () => {
      if (video.paused || video.ended) return;

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      requestAnimationFrame(drawFrame);
    };

    drawFrame();

    await new Promise((resolve) => {
      video.onended = resolve;
    });

    if (recorder.state !== "inactive") {
      recorder.stop();
    }

    await recording;

    stream.getTracks().forEach((track) => track.stop());
    await audioContext?.close();

    const compressedBlob = new Blob(chunks, { type: getBaseMimeType(mimeType) });

    if (!compressedBlob.size || compressedBlob.size >= file.size) {
      return file;
    }

    const extension = getExtensionFromMimeType(mimeType);
    const fileName = file.name.replace(/\.[^.]+$/, "");

    return new File([compressedBlob], `${fileName}.${extension}`, {
      type: getBaseMimeType(mimeType),
      lastModified: Date.now(),
    });
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
};

const Battle = () => {
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [entries, setEntries] = useState([]);
  const [deadline, setDeadline] = useState("");
  const [prize, setPrize] = useState("");
  const [prizeObject, setPrizeObject] = useState({});
  const [genre, setGenre] = useState("");
  const [type, setType] = useState("")
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState("");
  const { loggedInUser } = useContext(AuthContext);
  const { battleId } = useParams();
  const [battleStatus, setBattleStatus] = useState("");
  const [battleAttachment, setBattleAttachment] = useState("");
  const [userHasVoted, setUserHasVoted] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userEntry, setUserEntry] = useState(null);
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);
  const [usersCache, setUsersCache] = useState({});
  const [userVotes, setUserVotes] = useState(null);
  const [loggedInUserDoc, setLoggedInUserDoc] = useState({});
  const [writtenByUser, setWrittenByUser] = useState(null);
  const [prizeInfoVisible, setPrizeInfoVisible] = useState(false)

  // ✅ Fisher–Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    getUser();
    getBattle();
    getWinner();
    getUserEntry();
  }, []);

  useEffect(() => {
    console.log(usersCache);
  }, [usersCache]);

  const getUser = async () => {
    const userRef = doc(db, "users", loggedInUser.uid);
    const snapshot = await getDoc(userRef);
    setLoggedInUserDoc(snapshot.data());
  };

  const getBattle = async () => {
    try {
      const docRef = doc(db, "battles", battleId);
      const entriesRef = collection(db, "battles", battleId, "entries");

      const q = query(entriesRef, orderBy("date", "asc"));
      const entriesDocs = await getDocs(q);
      const battleSnapshot = await getDoc(docRef);

      const data = battleSnapshot.data();

      if (data) {
        setTitle(data.title);
        setBattleStatus(data.status);
        setType(data.type)
        setBattleAttachment(data.file);
        setDeadline(data.deadline);
        setPrize(data.prize.value);
        setPrizeObject(data.prize)
        setGenre(data.genre);
        setVoters(data.voters);
        setPeriod(data.period);
      }

      if (data.writtenBy) {
        const writtenByRef = doc(db, "users", data.writtenBy);
        const writtenBySnapshot = await getDoc(writtenByRef);
        setWrittenByUser(writtenBySnapshot.data());
      }

      let entries = [];
      entriesDocs.forEach((doc) => {
        entries.push(doc.data());
      });

      const filtered = entries.filter((e) => e.uid !== loggedInUser.uid);

      // ✅ Shuffle entries
      const shuffled = shuffleArray(filtered);

      setEntries(shuffled);
      await fetchUsersForEntries(shuffled);

      const votesRef = collectionGroup(db, "votes");

      const votesQuery = query(
        votesRef,
        where("uid", "==", loggedInUser.uid),
        where("battleId", "==", battleId)
      );

      onSnapshot(votesRef, async () => {
        const votesQuerySnapshot = await getDocs(votesQuery);
        setUserVotes(votesQuerySnapshot.docs.length);
      });

      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsersForEntries = async (entriesData) => {
    if (entriesData.length === 0) return;

    const uniqueUids = [...new Set(entriesData.map((e) => e.uid))];
    const uncachedUids = uniqueUids.filter((uid) => !usersCache[uid]);

    if (uncachedUids.length === 0) return;

    const userPromises = uncachedUids.map((uid) =>
      getDoc(doc(db, "users", uid))
    );

    const userDocs = await Promise.all(userPromises);
    const newCache = { ...usersCache };

    userDocs.forEach((userDoc, index) => {
      if (userDoc.exists()) {
        const data = userDoc.data();
        newCache[uncachedUids[index]] = {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          headshot: data.headshot,
        };
      }
    });

    setUsersCache(newCache);
  };

  const getUserEntry = () => {
    const entryRef = doc(db, "battles", battleId, "entries", loggedInUser.uid);

    if (entryRef) {
      try {
        onSnapshot(entryRef, (snapshot) => {
          setUserEntry(snapshot.data());
        });
      } catch (error) { }
    }
  };

  const getWinner = async () => {
    try {
      const battleRef = doc(db, "battles", battleId);
      const snapshot = await getDoc(battleRef);
      const winner = snapshot.data().winner;

      const userRef = doc(db, "users", winner);
      const userSnapshot = await getDoc(userRef);

      setWinner(userSnapshot.data());
    } catch (error) {
      console.log(error);
    }
  };

  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleUploadBattle = async () => {
    if (!file || !loggedInUser) return;

    try {
      setUploadStatus("processing");
      setUploadMessage("Checking and compressing your tape...");

      await assertVideoIsPlayable(file);
      const fileToUpload = await compressVideoFile(file);

      if (isQuickTimeVideo(file) && fileToUpload === file) {
        throw new Error(
          "This .mov file could not be converted before upload. Please export your tape as an H.264 MP4 and upload it again."
        );
      }

      setUploadStatus("uploading");
      setUploadMessage(
        fileToUpload.size < file.size
          ? "Compressed. Uploading your tape..."
          : "Uploading your tape..."
      );

      const storageRef = ref(
        storage,
        `battles/${battleId}/${loggedInUser.uid}`
      );

      await uploadBytesResumable(storageRef, fileToUpload, {
        contentType: getUploadContentType(fileToUpload),
      });

      const url = await getDownloadURL(storageRef);

      const entryRef = doc(
        db,
        "battles",
        battleId,
        "entries",
        loggedInUser.uid
      );

      const userRef = doc(db, "users", loggedInUser.uid);

      await runTransaction(db, async (transaction) => {
        const entrySnapshot = await transaction.get(entryRef);

        transaction.set(entryRef, {
          uid: loggedInUser.uid,
          url,
          voteCount: entrySnapshot.exists()
            ? entrySnapshot.data().voteCount ?? 0
            : 0,
          date: entrySnapshot.exists()
            ? entrySnapshot.data().date ?? Date.now()
            : Date.now(),
          shareSetting: entrySnapshot.exists()
            ? entrySnapshot.data().shareSetting ?? "private"
            : "private",
          battleId,
          feedbackOn: entrySnapshot.exists()
            ? entrySnapshot.data().feedbackOn ?? true
            : true,
          fileName: fileToUpload.name,
          fileType: fileToUpload.type,
        });

        if (!entrySnapshot.exists()) {
          transaction.update(userRef, {
            coins: increment(5),
            totalCoinsEarned: increment(5),
            battlesEntered: increment(1),
            withdrawals: arrayUnion({
              amount: 5,
              complete: true,
              uid: loggedInUser.uid,
              direction: "inbound",
            }),
          });
        }
      });

      setUploadStatus("complete");
      setUploadMessage("");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Upload failed:", error);
      setErrorMessage(error.message || "Upload failed. Please try again.");
      setUploadStatus("error");
      setUploadMessage("");
    }
  };

  return (
    <div className="Battle screen-width">
      {errorMessage && (
        <MessageModal
          onClick={() => setErrorMessage("")}
          title="Hang on!"
          text={errorMessage}
          buttonText="Okay, got it!"
        />
      )}

      {showMessageModal && (
        <MessageModal
          confetti
          onClick={() => setShowMessageModal(false)}
          title="Nice work!"
          text="5 coins earned"
          buttonText="Close"
          icon={<Coin width="100" />}
        />
      )}

      {howToPlayVisible && (
        <div className="battle-how-to-play-container">
          <BackButton onClick={() => setHowToPlayVisible(false)} />
          <HowToPlay />
        </div>
      )}

      {prizeInfoVisible && (
        <div className="battle-how-to-play-container prize-info-container">
          <BackButton onClick={() => setPrizeInfoVisible(false)} />
          <h2>{prizeObject.value}</h2>
          <p>{prizeObject?.link}</p>
          <div className="prize-info-video-container">
            <video controls src="https://firebasestorage.googleapis.com/v0/b/self-tape-battle.appspot.com/o/random%2Fselftape%20ad.MP4?alt=media&token=294952ff-7822-49b8-9ce4-73093e3b2d83"></video>
          </div>
        </div>
      )}

      <Link to="/" className="back">
        <BackButton />
      </Link>

      <div className="sponsor-banner-container">
        <SponsorBanner/>
      </div>

      <div className="battle-header">
        <div className="battle-header-left">
          {loading ? (
            <Skeleton height={35} />
          ) : (
            <>
              <h3 className="battle-title">{title}</h3>
              <div className="pill-container">
                {battleStatus === "open" && <h4 className="period">
                  {period === "entry" ? "Entry" : "Voting"} Period
                </h4>}
                {type === "sponsored" && <h4 className="sponsored">
                  Sponsored
                </h4>}
              </div>

              {writtenByUser && (
                <div className="writtenBy">
                  <p>Written by</p>
                  <Link
                    to={`/profile/${writtenByUser.username}`}
                    className="link"
                  >
                    <div
                      className="headshot"
                      style={{
                        backgroundImage: `url('${writtenByUser.headshot}')`,
                      }}
                    ></div>
                    <h4>
                      {writtenByUser.firstName}{" "}
                      {writtenByUser.lastName}
                    </h4>
                  </Link>
                </div>
              )}
            </>
          )}

          {loading ? (
            <Skeleton height={100} />
          ) : (
            <div className="battle-info">
              <span className="prize-container">
                {typeof prize === "string" ? (
                  <img src={chest} />
                ) : (
                  <Coin width="30" />
                )}
                {prize}
                {prizeObject.infoVisible && <i className="fa-solid fa-circle-info" onClick={() => setPrizeInfoVisible(true)}></i>}
              </span>

              <span className="info-pill">
                <i className="fa-solid fa-masks-theater"></i>
                {genre}
              </span>

              <span className="info-pill">
                <i className="fa-solid fa-calendar"></i>
                {deadline}
              </span>
            </div>
          )}
        </div>
      </div>

      {battleStatus === "winner_pending" && (
        <h4 className="winner-pending">Winner announced soon..</h4>
      )}

      {battleStatus === "open" && (
        <div className="button-container">
          {!userEntry && !file && !loading && period === "entry" && (
            <Button
              onClick={() => inputRef.current.click()}
              text="Upload Tape"
              className="upload-tape"
              filled_color
            />
          )}

          <a href={battleAttachment} download target="_blank">
            <Button text="Download Monologue" outline />
          </a>

          <Button
            text="How to play"
            icon={<i className="fa-solid fa-circle-info"></i>}
            onClick={() => setHowToPlayVisible(true)}
            outline
          />

          {period === "voting" && <p className="user-votes">
            Votes Remaining:{" "}
            <strong>{5 - userVotes}</strong>
          </p>}
        </div>
      )}

      {file && (
        <div className="file-container">
          {uploadStatus === "uploading" && (
            <span className="uploading">
              {uploadMessage || "Uploading..larger videos may take a bit longer.."}
            </span>
          )}

          {uploadStatus === "processing" && (
            <span className="uploading">
              {uploadMessage || "Checking and compressing your tape..."}
            </span>
          )}

          {uploadStatus === "" && (
            <>
              <p className="file-name">{file.name}</p>
              <div className="button-container">
                <Button
                  onClick={handleUploadBattle}
                  text="Post"
                  filled_color
                />
                <Button
                  onClick={() => setFile(null)}
                  text="Cancel"
                  outline
                />
              </div>
            </>
          )}
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const selectedFile = e.target.files[0];

          if (!selectedFile) return;

          setErrorMessage("");
          setUploadStatus("");
          setUploadMessage("");
          setFile(selectedFile);
        }}
        accept="video/mp4,video/quicktime,.mp4,.mov"
      />

      {winner && battleStatus === "closed" && (
        <div className="winner">
          <div
            className="winner-avatar"
            style={{ backgroundImage: `url(${winner.headshot})` }}
          ></div>
          <div className="winner-right">
            <span>WINNER</span>
            {winner.firstName + " " + winner.lastName}
          </div>
        </div>
      )}

      <div className="entries-container">
        {userEntry && (
          <EntryCard
            url={userEntry.url}
            uid={userEntry.uid}
            battleId={battleId}
            voteButtonVisible={userEntry.uid !== loggedInUser.uid}
            battleStatus={battleStatus}
            isPillVisible={true}
            userData={loggedInUserDoc}
            userVotes={userVotes}
            menu
            feedbackOn={userEntry.feedbackOn}
            title={title}
            period={period}
          />
        )}

        {entries.map((entry) => (
          <EntryCard
            key={entry.uid}
            url={entry.url}
            uid={entry.uid}
            battleId={battleId}
            voteButtonVisible={entry.uid !== loggedInUser.uid}
            battleStatus={battleStatus}
            userData={usersCache[entry.uid]}
            userVotes={userVotes}
            poster={usersCache[entry.uid]?.headshot}
            feedbackOn={entry.feedbackOn}
            title={title}
            period={period}
          />
        ))}
      </div>
    </div>
  );
};

export default Battle;
