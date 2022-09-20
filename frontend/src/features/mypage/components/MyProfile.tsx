// image
import cat from "../../../assets/characters/cat.svg";
// css
import styles from "../MyPage.module.css";

const MyProfile = () => {
  return (
    <div className={styles.MyProfile}>
      <div className={styles.MyProfileImgBox}>
        <img className={styles.MyProfileImg} src={cat} alt="" />
      </div>

      <div className={styles.MyProfileTextBox}>
        <h2 className={styles.MyProfileText}>Nickname</h2>
        <h4 className={styles.MyProfileTex}>Wallet Address</h4>
        <h3 className={styles.MyProfileText}>1000 SSF</h3>
      </div>
    </div>
  );
};

export default MyProfile;
