import React from "react";
import { useNavigate } from "react-router-dom";

import IMG from "../../../assets/btn/sale_btn.svg";
import styles from "../SNS.module.css";

const MoveSale = () => {
  const navigate = useNavigate();
  return (
    <button
      className={styles.btn}
      onClick={() => {
        navigate("/sale");
      }}
    >
      <div className={styles.box}>
        <img className={styles.btnImg} src={IMG} alt="" />
        <p className={styles.text}>
          NFT
          <br />
          구경가기
        </p>
      </div>
    </button>
  );
};

export default MoveSale;
