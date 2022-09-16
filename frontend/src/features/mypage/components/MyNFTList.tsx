// components
import MyNFTCard from "./MyNFTCard";
// css
import styles from "../MyPage.module.css";

const MyNFTList = () => {
  return (
    <div className={styles.MyNFTList}>
      <MyNFTCard />
    </div>
  );
};

export default MyNFTList;
