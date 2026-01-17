import "./Coin.scss";
import coin_background from "../media/coin_background.svg";
import sparkle from "../media/sparkle.svg";

const Coin = ({ width }) => {
  return (
    <div className="Coin" style={{ width: `${width}px` }}>
      <img src={coin_background} className="coin_background" />
      <img src={sparkle} className="sparkle" />
    </div>
  );
};

export default Coin;
