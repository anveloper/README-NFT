// css
import styles from "../Welcome.module.css";
// img
import cloud1 from "assets/welcome/page3_cloud1.svg";
import cloud2 from "assets/welcome/page3_cloud2.svg";
import game from "assets/welcome/page3_game.gif";

const WelcomePageThree = ({ gameRef }: any) => {
  return (
    <div id="3" className={styles.welcomePageThree} ref={gameRef}>
      <h1 className={styles.WelcomeTitleText}>
        게임을 통해 특별한 NFT를 소유하세요!
      </h1>
      <h4 className={styles.WelcomeDescriptionText}>
        제시어를 입력하고 독창적인 나만의 그림을 그리세요!
      </h4>

      <img className={styles.page3_cloud1} src={cloud1} alt="" />
      <img className={styles.page3_cloud2} src={cloud2} alt="" />

      <img className={styles.page3_gameDisplay} src={game} alt="" />
    </div>
  );
};

export default WelcomePageThree;
