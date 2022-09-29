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
import WelcomePageStart from "./components/WelcomePageStart";
import WelcomePageTwo from "./components/WelcomePageTwo";
import WelcomePageThree from "./components/WelcomePageThree";
import WelcomePageFour from "./components/WelcomePageFour";
import WelcomePageFive from "./components/WelcomePageFive";
import WelcomePageSix from "./components/WelcomePageSix";
// img
import welcome_character from "../../assets/welcome/welcome_character.svg";

const Welcome = () => {
  return (
    <div className={styles.Welcome}>
      {/* <WelcomeNavbar /> */}
      <img
        className={styles.welcome_character}
        src={welcome_character}
        alt=""
      />
      <WelcomePageSix />
      <WelcomePageFive />
      <WelcomePageFour />
      <WelcomePageThree />
      <WelcomePageTwo />
      <WelcomePageStart />

      {/* <WalletAddress />

      <NFTDescription />

      <GameDescription />

      <RoadMap />

      <Developers /> */}
    </div>
  );
};

export default Welcome;
