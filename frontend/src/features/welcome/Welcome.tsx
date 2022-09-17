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
  // const [scroll, setScroll] = useState(0);

  // const onScrollFunction = () => {
  //   setScroll(window.scrollY);
  // };

  // useEffect(() => {
  //   console.log(window.scrollY);
  //   scrollFunction();
  // }, [scroll]);

  // const wheel = useRef<HTMLDivElement>(null);

  // const scrollFunction = () => {
  //   if (scroll > 0 && scroll < 5) {
  //     if (wheel.current) {
  //       wheel.current.scrollIntoView({ behavior: "smooth" });
  //     }
  //   } else {
  //     return;
  //   }
  // };

  // useEffect(() => {
  //   scrollFunction();
  // }, [scroll]);

  return (
    <div className={styles.Welcome}>
      <WelcomeNavbar />

      {/* <div onWheel={onScrollFunction}>
        <div ref={wheel}> */}
      <WalletAddress />
      {/* </div> */}

      {/* <div ref={wheel}> */}
      <NFTDescription />
      {/* </div> */}

      {/* <div ref={wheel}> */}
      <GameDescription />
      {/* </div> */}

      {/* <div ref={wheel}> */}
      <RoadMap />
      {/* </div> */}

      {/* <div ref={wheel}> */}
      <Developers />
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default Welcome;
