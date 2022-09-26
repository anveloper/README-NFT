import styles from "./NftDetail.module.css";
import BackgroundFlower from "../../components/BackgroundFlower";

interface SaleAnimalProps {
  account: String;
}

const NftSell = () => {
  return (
    <div className={styles.sell_background}>
      <BackgroundFlower />
      <div className={styles.detail}>
        <div className={styles.detail_container}>
          <div className={styles.cards}>
            <div className={styles.card_contents_front}>
              <img className={styles.card_img} src={require("../../assets/nft-img/1.png")} alt="dog" />
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
    </div>
  );
};

export default NftSell;
