// css
import styles from "../Welcome.module.css";
// img
import white_cloud from "../../../assets/welcome/page1_cloud1.svg";
import yellow_cloud from "../../../assets/welcome/page1_cloud2.svg";
import welcome_character from "../../../assets/welcome/welcome_character.svg";
import WelcomeNavbar from "./WelcomeNavbar";

const WelcomePageStart = () => {
  return (
    <div className={styles.MotionArea}>
      <div
        className={`${styles.WelcomeBackground} ${styles.one} ${styles.active}`}
      ></div>
      <div className={`${styles.WelcomeBackground} ${styles.two}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.three}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.four}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.five}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.six}`}></div>

      <WelcomeNavbar />

      <h1 className={styles.page1_logo}>README</h1>

      <img className={styles.page1_cloud1} src={white_cloud} alt="" />
      <img className={styles.page1_cloud2} src={yellow_cloud} alt="" />
      <div className={styles.ground}></div>

      {/* <img
        className={styles.welcome_character}
        src={welcome_character}
        alt=""
      /> */}
    </div>
  );
};

export default WelcomePageStart;
