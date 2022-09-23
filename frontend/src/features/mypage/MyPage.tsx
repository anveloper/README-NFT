import { FC } from "react";
// components
import MyAnimalCard from "./components/MyAnimalCard";
import MyInfo from "./components/MyInfo";
import MyNFTList from "./components/MyNFTList";
// css
import styles from "./MyPage.module.css";

interface MyPageProps {
  account: string;
}

const MyPage: FC<MyPageProps> = ({ account }) => {
  console.log(account);
  return (
    <div className={styles.MyPage}>
      <div className={styles.MyProfileInfo}>
        <MyInfo account={account} />
      </div>

      <div className={styles.MyNFTView}>
        <MyNFTList />
      </div>
    </div>
  );
};

export default MyPage;
