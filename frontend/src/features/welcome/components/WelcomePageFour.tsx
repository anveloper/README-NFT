// components
import WelcomeNavbar from "./WelcomeNavbar";
// css
import styles from "../Welcome.module.css";
// img
import moon from "../../../assets/welcome/moon.svg";
import cloud1 from "../../../assets/welcome/page4_cloud1.svg";
import cloud2 from "../../../assets/welcome/page4_cloud2.svg";
import cloud3 from "../../../assets/welcome/page4_cloud3.svg";
import cloud4 from "../../../assets/welcome/page4_cloud4.svg";
import star1 from "../../../assets/welcome/page4_star1.svg";
import star2 from "../../../assets/welcome/page4_star2.svg";
import star3 from "../../../assets/welcome/page4_star3.svg";
import star4 from "../../../assets/welcome/page4_star4.svg";
import star5 from "../../../assets/welcome/page4_star5.svg";
import star6 from "../../../assets/welcome/page4_star6.svg";
import star7 from "../../../assets/welcome/page4_star7.svg";

const WelcomePageFour = () => {
  return (
    <div className={styles.MotionArea}>
      <div className={`${styles.WelcomeBackground} ${styles.one}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.two}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.three}`}></div>
      <div
        className={`${styles.WelcomeBackground} ${styles.four} ${styles.active}`}
      ></div>
      <div className={`${styles.WelcomeBackground} ${styles.five}`}></div>
      <div className={`${styles.WelcomeBackground} ${styles.six}`}></div>

      <WelcomeNavbar color={"#ffffff"} />

      <h1 className={styles.WelcomeTitleText} style={{ color: "#ffffff" }}>
        README, 개발 목표는요!
      </h1>

      <img className={styles.page4_cloud1} src={cloud1} alt="" />
      <img className={styles.page4_cloud2} src={cloud2} alt="" />
      <img className={styles.page4_cloud3} src={cloud3} alt="" />
      <img className={styles.page4_cloud4} src={cloud4} alt="" />

      <img className={styles.moon} src={moon} alt="" />
      <img className={styles.page4_star1} src={star1} alt="" />
      <img className={styles.page4_star2} src={star1} alt="" />
      <img className={styles.page4_star3} src={star2} alt="" />
      <img className={styles.page4_star4} src={star2} alt="" />
      <img className={styles.page4_star5} src={star2} alt="" />
      <img className={styles.page4_star6} src={star2} alt="" />
      <img className={styles.page4_star7} src={star3} alt="" />
      <img className={styles.page4_star8} src={star4} alt="" />
      <img className={styles.page4_star9} src={star5} alt="" />
      <img className={styles.page4_star10} src={star6} alt="" />
      <img className={styles.page4_star11} src={star7} alt="" />
    </div>
  );
};

export default WelcomePageFour;
