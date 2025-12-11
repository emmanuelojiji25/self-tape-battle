import "./Loader.scss";
import logo from "../media/logo-icon.svg";

const Loader = () => {
  return (
    <div className="feed-loader-container">
      <img src={logo} className="loader" />
    </div>
  );
};

export default Loader;
