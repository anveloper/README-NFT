import styles from "../MyPage.module.css";
import MyProfile from "./MyProfile";

const MyInfo = () => {
  return (
    <div className={styles.MyInfo}>
      <MyProfile />

      <div>
        <h6>보유한 NFT</h6>
        <hr />
        <h6>찜한 NFT</h6>
        <hr />
        <h6>내가 그린 NFT</h6>
      </div>
    </div>
  );
};

export default MyInfo;
