import "./SideMenu.scss";

const SideMenu = ({ sideMenuVisible, setSideMenuVisible }) => {
  return (
    <div className={`SideMenu ${sideMenuVisible ? "slideIn" : "slideOut"}`}>
      <h1 onClick={() => setSideMenuVisible(false)}>close</h1>
      <p>Profile</p>
      <p>How to play</p>
      <p>Submit feedback</p>
      <p>Contact</p>
      <p>Sign out</p>
    </div>
  );
};

export default SideMenu;
