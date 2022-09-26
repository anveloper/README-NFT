// import { useEffect, useRef, useState } from "react";
// component
import WelcomeNavbar from "./components/WelcomeNavbar";
import WalletAddress from "./components/WalletAddress";
import NFTDescription from "./components/NFTDescription";
import GameDescription from "./components/GameDescription";
import RoadMap from "./components/RoadMap";
import Developers from "./components/Developers";
// css
import styles from "./Welcome.module.css";

const Welcome = () => {
  return (
    <div className={styles.Welcome}>
      <WelcomeNavbar />

      <WalletAddress />

      <NFTDescription />

      <GameDescription />

      <RoadMap />

      <Developers />
    </div>
  );
};

export default Welcome;
