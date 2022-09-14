import React from "react";
import styles from "./Detail.module.css";

const Detail = () => {
  return (
    <div className={styles.detail}>
      <div className={styles.detail_container}>
        <div className={styles.cards}>
          <div className={styles.card_img}>카드 이미지</div>
          <div className={styles.card_contents}>카드 내용</div>
        </div>
        <div className={styles.cards}>
          <div className={styles.card_img}>카드 이미지</div>
          <div className={styles.card_contents}>카드 내용</div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
