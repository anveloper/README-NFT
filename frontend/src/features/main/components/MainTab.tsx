import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import UnderLine from "./UnderLine";
// css
import styles from "./MainTab.module.css";
import BtnLive from "../../../assets/btn/btn_live.svg";
import BtnNFT from "../../../assets/btn/btn_nft.svg";

const MainTab = () => {
  const [under, setUnder] = useState("left");
  const tabRef = useRef<HTMLDivElement | null>(null);
  const handleScroll = () => {
    tabRef.current?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  };
  return (
    <div className={styles.tabContainer} ref={tabRef}>
      <div className={styles.tabInfo}>
        <p className={styles.tabTitle}>내 마음을 읽어줘!</p>
        <p className={styles.tabDescription}>
          실시간 [리드미]게임에 참여하여 NFT의 정답자가 되어보세요.
          <br />
          현재 발행된 [리드미] NFT를 구경하세요.
        </p>
      </div>
      <div className={styles.tab}>
        <div className={styles.btnBox}>
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
    </div>
  );
};

export default MainTab;
