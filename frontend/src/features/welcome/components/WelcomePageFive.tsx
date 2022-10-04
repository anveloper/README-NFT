// css
import styles from "../Welcome.module.css";
import WelcomeNavbar from "./WelcomeNavbar";
// img
import developers from "assets/welcome/page5_developers.svg";
import cloud from "assets/welcome/page6_cloud2.svg";

const WelcomePageFive = () => {
  return (
    <div className={styles.MotionArea}>
      <div className={`${styles.WelcomeBackground} ${styles.one}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.two}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.three}`}></div>
      <div
        className={`${styles.WelcomeBackground} ${styles.four} ${styles.active}`}
      ></div>
      <div
        className={`${styles.WelcomeBackground} ${styles.five} ${styles.active}`}
      ></div>
      <div className={`${styles.WelcomeBackground} ${styles.six}`}></div>

      <WelcomeNavbar color={"#ffffff"} />

      <h1 className={styles.WelcomeTitleText} style={{ color: "#ffffff" }}>
        개발자를 소개합니다!
      </h1>
      <img className={styles.page5_cloud1} src={cloud} alt="" />
      <img className={styles.page5_cloud2} src={cloud} alt="" />

      <img className={styles.page5_developers} src={developers} alt="" />
    </div>
  );
};

export default WelcomePageFive;
