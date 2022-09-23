import { FC } from "react";
import styles from "../MyPage.module.css";
import MyProfile from "./MyProfile";

interface MyInfoProps {
  account: string;
}

const MyInfo: FC<MyInfoProps> = ({ account }) => {
  return (
    <div className={styles.MyInfo}>
      <MyProfile account={account} />

      <div className={styles.MyNFTInfo}>
        <p className={styles.MyNFTInfoButton}>보유한 NFT</p>
        <hr />
        <p className={styles.MyNFTInfoButton}>찜한 NFT</p>
        <hr />
        <p className={styles.MyNFTInfoButton}>내가 그린 NFT</p>
      </div>
    </div>
  );
};

export default MyInfo;
