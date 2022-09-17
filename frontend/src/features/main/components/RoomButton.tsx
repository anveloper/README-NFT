import React from "react";
import styles from "./RoomButton.module.css";
import IMG from "../../../assets/carousel/plane02.svg";

const RoomButton = (prop: any) => {
  const { setModalOpen } = prop;

  return (
    <button className={styles.container} onClick={setModalOpen}>
      <div className={styles.btn}>
        <p className={styles.text}>내 방 만들기</p>
        <img className={styles.img} src={IMG} alt="" />
      </div>
    </button>
  );
};

export default RoomButton;
