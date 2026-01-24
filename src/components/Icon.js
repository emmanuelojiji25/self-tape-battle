import "./Coin.scss";
import coin_background from "../media/coin_background.svg";
import chest from "../media/chest.svg";
import sparkle from "../media/sparkle.svg";

export const Coin = ({ width }) => {
  return (
    <div className="Coin" style={{ width: `${width}px` }}>
      <img src={coin_background} className="coin_background" />
      <img src={sparkle} className="sparkle" />
    </div>
  );
};

export const Chest = ({ width }) => {
  return (
    <div className="Chest" style={{ width: `${width}px` }}>
      <img src={chest} className="chest_img" />
      <img src={sparkle} className="sparkle" />
    </div>
  );
};
