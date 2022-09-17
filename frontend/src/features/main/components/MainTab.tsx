import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import UnderLine from "./UnderLine";
// css
import styles from "../Main.module.css";
import BtnLive from "../../../assets/btn/btn_live.svg";
import BtnNFT from "../../../assets/btn/btn_nft.svg";

const MainTab = () => {
  const [under, setUnder] = useState("");
  const tabRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    tabRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.tab}>
      <div className={styles.btnBox} ref={tabRef}>
        <Link to="/live">
          <button
            className={styles.btnContainer}
            onClick={() => {
              setUnder("left");
              handleScroll();
            }}
          >
            <p className={styles.btn}>
              <img src={BtnLive} alt="" />
            </p>
            <p className={styles.btnText}>실시간 리드미</p>
          </button>
        </Link>
        <Link to="/list">
          <button
            className={styles.btnContainer}
            onClick={() => {
              setUnder("right");
              handleScroll();
            }}
          >
            <p className={styles.btn}>
              <img src={BtnNFT} alt="" />
            </p>
            <p className={styles.btnText}>NFT 구경하기</p>
          </button>
        </Link>
      </div>
      <UnderLine under={under} />
    </div>
  );
};

export default MainTab;
