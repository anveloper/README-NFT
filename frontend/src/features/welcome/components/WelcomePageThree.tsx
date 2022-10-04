// css
import styles from "../Welcome.module.css";
// img
import cloud1 from "assets/welcome/page3_cloud1.svg";
import cloud2 from "assets/welcome/page3_cloud2.svg";

const WelcomePageThree = ({ gameRef }: any) => {
  return (
    <div id="2" className={styles.welcomePageThree} ref={gameRef}>
      <h1 className={styles.WelcomeTitleText}>
        게임을 통해 특별한 NFT를 소유하세요!
      </h1>
      <h4 className={styles.WelcomeDescriptionText}>게임에 관한 설명 텍스트</h4>

      <img className={styles.page3_cloud1} src={cloud1} alt="" />
      <img className={styles.page3_cloud2} src={cloud2} alt="" />

      <div className={styles.page3_gameDisplay}></div>
    </div>
  );
};

export default WelcomePageThree;
