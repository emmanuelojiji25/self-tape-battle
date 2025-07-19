import PollCard from "../components/PollCard";

const Feed = () => {
  return (
    <div className="screen-width">
      <h1>Feed</h1>
      <PollCard
        question="I need help, which shoes should I wear tonight!!"
        type="image"
      />
      <PollCard
        question="Can someone choose a dress colour for me pleaseeeee"
        type="text"
      />
    </div>
  );
};

export default Feed;
