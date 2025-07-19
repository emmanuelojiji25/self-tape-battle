import "./PollCard.scss";

const PollCard = ({ type, question }) => {
  return (
    <div className="PollCard">
      <div className="poll-card-header">
        <h4>Jack</h4>
        <span>2 mins ago</span>
      </div>
      <h3>{question}</h3>

      {type === "text" && (
        <div className="poll-bar-container">
          <div className="poll-bar" />
          <div className="poll-bar" />
        </div>
      )}
    </div>
  );
};

export default PollCard;
