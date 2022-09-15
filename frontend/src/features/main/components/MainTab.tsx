import React, { useState } from "react";
import { Link } from "react-router-dom";

import UnderLine from "./UnderLine";
// css
import styles from "../Main.module.css";
import BtnLive from "../../../assets/btn/btn_live.svg";
import BtnNFT from "../../../assets/btn/btn_nft.svg";

const MainTab = () => {
  const [under, setUnder] = useState("");
  return (
    <div className={styles.tab}>
      <div className={styles.btnBox}>
        <Link to="/live">
          <button
            className={styles.btn}
            onClick={() => {
              setUnder("left");
            }}
          >
            <img src={BtnLive} alt="" />
            <p>실시간 리드미</p>
          </button>
        </Link>
        <Link to="/list">
          <button
            className={styles.btn}
            onClick={() => {
              setUnder("right");
            }}
          >
            <img src={BtnNFT} alt="" />
            <p>NFT 구경하기</p>
          </button>
        </Link>
      </div>
      <UnderLine under={under} />
    </div>
  );
};

export default MainTab;
