import { useAppSelector } from "app/hooks";
import { selectUserAddress } from "features/auth/authSlice";
import { useState } from "react";
// components
import MyInfo from "./components/MyInfo";
import MyNFTList from "./components/MyNFTList";
// css
import styles from "./MyPage.module.css";

const MyPage = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const [NFTListValue, setNFTListValue] = useState("myNFT");

  return (
    <div className={styles.MyPage}>
      <div className={styles.MyProfileInfo}>
        <MyInfo account={userAddress} setNFTListValue={setNFTListValue} />
      </div>

      <div className={styles.MyNFTView}>
        <MyNFTList NFTListValue={NFTListValue} />
      </div>
    </div>
  );
};

export default MyPage;
