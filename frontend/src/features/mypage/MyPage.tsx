import { FC, useState } from "react";
// components
import MyInfo from "./components/MyInfo";
import MyNFTList from "./components/MyNFTList";
// css
import styles from "./MyPage.module.css";

interface MyPageProps {
  account: string;
}

const MyPage: FC<MyPageProps> = ({ account }) => {
  const [NFTListValue, setNFTListValue] = useState("");

  console.log(account);
  return (
    <div className={styles.MyPage}>
      <div className={styles.MyProfileInfo}>
        <MyInfo account={account} setNFTListValue={setNFTListValue} />
      </div>

      <div className={styles.MyNFTView}>
        <MyNFTList NFTListValue={NFTListValue} />
      </div>
    </div>
  );
};

export default MyPage;
