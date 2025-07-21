import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRef, useState } from "react";
import { db, storage } from "../firebaseConfig";
import "./CreatePoll.scss";

const CreatePoll = ({ user }) => {
  const [type, setType] = useState("text");

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [category, setCategory] = useState("unknown");

  const option1Ref = useRef(null);
  const option2Ref = useRef(null);

  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

  const [file1Preview, setFile1Preview] = useState("");
  const [file2Preview, setFile2Preview] = useState("");

  const handleCreatePoll = async () => {
    try {
      const docRef = await addDoc(collection(db, "polls"), {
        type,
        question,
        id: "",
        userId: user.uid,
        option1: {
          option: option1,
          votes: 0,
        },
        option2: {
          option: option2,
          votes: 0,
        },
        category,
      });

      await updateDoc(doc(db, "polls", docRef.id), {
        id: docRef.id,
      });

      if (type === "image") {
        const uploadFiles = [file1, file2].filter(Boolean);
        const urls = [];

        await Promise.all(
          uploadFiles.map(async (file, index) => {
            const storageRef = ref(
              storage,
              `polls/${docRef.id}/option${index + 1}_${file.name}`
            );
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            urls.push(url);
          })
        );

        await updateDoc(doc(db, "polls", docRef.id), {
          "option1.option": urls[0] || "",
          "option2.option": urls[1] || "",
        });
      }

      console.log("Poll created!");

      setQuestion("");
      setOption1("");
      setOption2("");
      setFile1(null);
      setFile2(null);
    } catch (error) {
      console.error("Couldn't upload sorry: ", error);
    }
  };

  const handleFilePreview = (e, setFile, setFilePreview) => {
    const newFile = e.target.files[0];
    setFile(newFile);
    if (newFile) {
      const preview = window.URL.createObjectURL(newFile);
      console.log(preview);
      setFilePreview(preview);
    }
  };

  return (
    <div className="CreatePoll">
      <input
        type="text"
        placeholder="Write question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <span onClick={() => setType(type === "image" ? "text" : "image")}>
        Switch to {type === "image" ? "text" : "image"} poll
      </span>

      <div className="poll-type-container">
        {type === "image" && (
          <div className="create-image-poll-container">
            <div className="placeholder-container">
              <div
                className="placeholder"
                onClick={() => option1Ref.current.click()}
                style={{ backgroundImage: `url(${file1Preview})` }}
              >
                1
              </div>
              <div
                className="placeholder"
                onClick={() => option2Ref.current.click()}
                style={{ backgroundImage: `url(${file2Preview})` }}
              >
                2
              </div>
            </div>

            <input
              type="file"
              ref={option1Ref}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFilePreview(e, setFile1, setFile1Preview)}
            />
            <input
              type="file"
              ref={option2Ref}
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => handleFilePreview(e, setFile2, setFile2Preview)}
            />
          </div>
        )}

        {type === "text" && (
          <div className="create-text-poll-container">
            <input
              type="text"
              className="bar-input"
              placeholder="Option 1"
              value={option1}
              onChange={(e) => setOption1(e.target.value)}
            />
            <input
              type="text"
              className="bar-input"
              placeholder="Option 2"
              value={option2}
              onChange={(e) => setOption2(e.target.value)}
            />
          </div>
        )}
      </div>

      <button onClick={handleCreatePoll}>Post</button>
    </div>
  );
};

export default CreatePoll;
