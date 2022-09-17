// image
import rabbit from "../../../assets/characters/rabbit.svg";
// css
import styles from "../MyPage.module.css";

const MyProfile = () => {
  return (
    <div className={styles.MyProfile}>
      <div>
        <img src={rabbit} alt="" />
      </div>

      <h2>Nickname</h2>
      <h5>Wallet Address</h5>
      <h3>1000 SSF</h3>
    </div>
  );
};

export default MyProfile;
