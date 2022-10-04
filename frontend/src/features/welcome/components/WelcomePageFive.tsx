// css
import styles from "../Welcome.module.css";
// img
import developers from "assets/welcome/page5_developers.svg";
import cloud from "assets/welcome/page6_cloud2.svg";

const WelcomePageFive = ({ pageFiveRef }: any) => {
  return (
    <div id="5" ref={pageFiveRef} className={styles.welcomePageFive}>
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
