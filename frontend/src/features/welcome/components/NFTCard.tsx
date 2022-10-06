import { FC } from "react";
// CSS
import styles from "../Welcome.module.css";

interface NFTCardProps {
  img: string;
  name: string;
  creater: string;
  owner: string;
}

const NFTCard: FC<NFTCardProps> = ({ img, name, creater, owner }) => {
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
        <p className={styles.NFTTextTitle}>Creater</p>
        <p className={styles.NFTTextMain}>{creater}</p>
      </div>

      <div className={styles.NFTCardText}>
        <p className={styles.NFTTextTitle}>Owner</p>
        <p className={styles.NFTTextMain}>{owner}</p>
      </div>
    </div>
  );
};

export default NFTCard;
