import "./Skeleton.scss";

const Skeleton = ({ height }) => {
  return <div className="Skeleton" style={{ height: `${height}px` }}></div>;
};

export default Skeleton;
