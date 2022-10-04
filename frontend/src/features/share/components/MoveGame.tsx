import React from "react";
// import { useNavigate } from "react-router-dom";

import IMG from "../../../assets/btn/game_btn.svg";
import styles from "../SNS.module.css";

const MoveGame = (props: any) => {
  // const navigate = useNavigate();
  const { className } = props;
  return (
    <button
      className={className}
      onClick={() => {
        window.location.href = "https://j7b108.p.ssafy.io/live";
        return null;
      }}
    >
      <div className={styles.box}>
        <img className={styles.btnImg} src={IMG} alt="" />
        <p className={styles.text}>
          리드미
          <br />
          게임하기
        </p>
      </div>
    </button>
  );
};

export default MoveGame;
