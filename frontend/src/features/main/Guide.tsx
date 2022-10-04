import React from "react";

import { ReactComponent as GuideImg } from "../../assets/logo_img.svg";
import { ReactComponent as Cloud1 } from "../../assets/carousel/carousel_cloud01.svg";
import { ReactComponent as Cloud2 } from "../../assets/carousel/carousel_cloud02.svg";
import { ReactComponent as Plane1 } from "../../assets/carousel/plane01.svg";
import { ReactComponent as Plane2 } from "../../assets/carousel/plane02.svg";

import styles from "./Main.module.css";
const Guide = ({ guideRef }: any) => {
  return (
    <div id="1" className={styles.guideContainer} ref={guideRef}>
      <div className={styles.guide}>
        <div>
          <p className={styles.guideTitle}>Read Me</p>
          <p className={styles.guideInfo}>
            그림을 그리고 퀴즈를 맞춰
            <br />
            나만의 NFT를 만들어 보세요.
          </p>
        </div>
        <GuideImg className={styles.guideImg} />
      </div>
      <Cloud1 className={styles.leftCloud} />
      <Cloud2 className={styles.rightCloud} />
      <Plane1 className={styles.leftPlane} />
      <Plane2 className={styles.rightPlane} />
    </div>
  );
};

export default Guide;
