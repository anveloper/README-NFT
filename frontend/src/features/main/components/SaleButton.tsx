import React from "react";
import { useNavigate } from "react-router-dom";

import IMG from "../../../assets/btn/sale_btn.svg";
import styles from "./SaleButton.module.css";

const SaleButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className={styles.container}
      onClick={() => {
        navigate("/sale");
      }}
    >
      <div className={styles.btn}>
        <p className={styles.text}>마켓 이동하기</p>
        <img className={styles.img} src={IMG} alt="" />
      </div>
    </button>
  );
};

export default SaleButton;
