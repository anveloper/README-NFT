// components
import MyNFTCard from "./MyNFTCard";
// css
import styles from "../MyPage.module.css";

const MyNFTList = () => {
  return (
    <div className={styles.MyNFTList}>
      <select name="" id="">
        <option value="sort">Sort</option>
        <option value="">이름순</option>
        <option value="">가격순</option>
      </select>

      <div className={styles.MyNFTCardList}>
        <MyNFTCard />
        <MyNFTCard />
      </div>
      <div className={styles.MyNFTCardList}>
        <MyNFTCard />
        <MyNFTCard />
      </div>
    </div>
  );
};

export default MyNFTList;
