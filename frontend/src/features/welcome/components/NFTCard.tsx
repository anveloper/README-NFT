import { FC } from "react";
// CSS
import styles from "../Welcome.module.css";

interface NFTCardProps {
  img: string;
  name: string;
  answer: string;
  creater: string;
  solver: string;
}

const NFTCard: FC<NFTCardProps> = ({ img, name, answer, creater, solver }) => {
  return (
    <div className={styles.NFTCard}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img className={styles.NFTCardImg} src={img} alt="" />
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>NFT Name</p>
        <p className={styles.NFTTextMain}>{name}</p>
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>Answer</p>
        <p className={styles.NFTTextMain}>{answer}</p>
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>Creater</p>
        <p className={styles.NFTTextMain}>{creater}</p>
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>Solver</p>
        <p className={styles.NFTTextMain}>{solver}</p>
      </div>
    </div>
  );
};

export default NFTCard;
