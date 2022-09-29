// components
import NFTCard from "./NFTCard";

// css
import styles from "../Welcome.module.css";

const NFTDescription = () => {
  return (
    <div className={styles.NFTDescription}>
      <h2>나만의 NFT를 만들어보세요!</h2>
      <div className={styles.NFTImg}>{/* <NFTCard /> */}</div>
    </div>
  );
};

export default NFTDescription;
