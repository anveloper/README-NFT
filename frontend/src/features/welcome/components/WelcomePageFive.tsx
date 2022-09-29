// css
import styles from "../Welcome.module.css";
import WelcomeNavbar from "./WelcomeNavbar";

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

      <WelcomeNavbar />

      <h1 className={styles.WelcomeTitleText} style={{ color: "#ffffff" }}>
        개발자를 소개합니다!
      </h1>
    </div>
  );
};

export default WelcomePageFive;
