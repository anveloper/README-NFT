import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Detail.module.css";

const Detail = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.detail}>
      <div className={styles.detail_container}>
        <div className={styles.cards}>
          <div className={styles.card_contents_front}>
            <img className={styles.card_img} src={require("../../assets/nft-img/dog.png")} alt="dog" />
            <div className={styles.card_img_info}>
              <p>NFT Name</p>
              <p>Price</p>
              <p>Creator</p>
              <p>Seller</p>
            </div>
          </div>
        </div>
        <div className={styles.cards}>
          <div className={styles.card_contents_back}>
            <div className={styles.card_contents_back_price}>
              <div>
                <p>현재 가격</p>
                <p>12 SSF</p>
              </div>
              <div>
                <button className={styles.card_button} onClick={() => navigate("/sell")}>
                  판매
                </button>
              </div>
            </div>
            <div className={styles.card_contents_back_history}></div>
            <div className={styles.card_buttons}>
              <button className={styles.card_button}>이전</button>
              <button className={styles.card_button}>경매 참여</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
