// css
import styles from "../Welcome.module.css";
// img
import cloud1 from "../../../assets/welcome/page6_cloud1.svg";
import cloud2 from "../../../assets/welcome/page6_cloud2.svg";

const WelcomePageSix = () => {
  return (
    <div className={styles.welcomePageSix}>
      <img className={styles.page6_cloud1} src={cloud1} alt="" />
      <img className={styles.page6_cloud2} src={cloud2} alt="" />

      <h1 className={styles.page6_logo}>README</h1>

      <div className={styles.page6_ground}></div>
    </div>
  );
};

export default WelcomePageSix;
