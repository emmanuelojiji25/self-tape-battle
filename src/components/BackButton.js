import "./BackButton.scss";

const BackButton = ({ onClick }) => {
  return (
    <div className="back-container" onClick={onClick}>
      <i class="fa-solid fa-arrow-left"></i>
      <span>Back</span>
    </div>
  );
};

export default BackButton;
