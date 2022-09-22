// components
import MyAnimalCard from "./components/MyAnimalCard";
import MyInfo from "./components/MyInfo";
import MyNFTList from "./components/MyNFTList";
// css
import styles from "./MyPage.module.css";

const MyPage = () => {
  return (
    <div className={styles.MyPage}>
      <div className={styles.MyProfileInfo}>
        <MyInfo />
      </div>

      <div className={styles.MyNFTView}>
        <MyNFTList />
      </div>
    </div>
  );
};

export default MyPage;
