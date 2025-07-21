import { useParams } from "react-router-dom";

const Profile = () => {
  const params = useParams();

  return (
    <div className="Profile">
      <h1>{params.username}</h1>
    </div>
  );
};

export default Profile;
