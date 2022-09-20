// image
import lion from "../../../assets/characters/lion.svg";
// css
import styles from "../MyPage.module.css";

const MyNFTCard = () => {
  return (
    <div className={styles.MyNFTCard}>
      <img className={styles.MyNFTCardImg} src={lion} alt="" />

      <div>
        <div className={styles.MyNFTCardTextBox}>
          <h4 className={styles.MyNFTCardLeftText}>NFT Name</h4>
          <p className={styles.MyNFTCardRightText}>Creater</p>
        </div>

        <div className={styles.MyNFTCardTextBox}>
          <h5 className={styles.MyNFTCardLeftText}>22 SSF</h5>
          <p className={styles.MyNFTCardRightText}>First Solver</p>
        </div>
      </div>
    </div>
  );
};

export default MyNFTCard;
