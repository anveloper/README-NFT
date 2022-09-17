// img
import lion from "../../../assets/characters/lion_palette.svg";
// CSS
import styles from "../Welcome.module.css";

const NFTCard = () => {
  return (
    <div className={styles.NFTCard}>
      <div className={styles.NFTtape1}></div>

      <div>
        <img className={styles.NFTCardImg} src={lion} alt="" />
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>NFT Name</p>
        <p className={styles.NFTTextMain}>Lion</p>
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>Answer</p>
        <p className={styles.NFTTextMain}>Lion</p>
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>Creater</p>
        <p className={styles.NFTTextMain}>피자먹는 라이언</p>
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>Solver</p>
        <p className={styles.NFTTextMain}>치킨먹는 라이언</p>
      </div>

      <div className={styles.NFTtape2}></div>
    </div>
  );
};

export default NFTCard;
