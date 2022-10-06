// css
import styles from "../Welcome.module.css";
// img
import cloud1 from "../../../assets/welcome/page1_cloud1.svg";
import cloud2 from "../../../assets/welcome/page1_cloud2.svg";
import cloud3 from "../../../assets/welcome/page1_cloud3.svg";
import cloud4 from "../../../assets/welcome/page1_cloud4.svg";

const WelcomePageOne = () => {
  return (
    <div className={styles.welcomePageOne}>
      <img className={styles.page1_cloud1} src={cloud1} alt="" />
      <img className={styles.page1_cloud2} src={cloud2} alt="" />
      <img className={styles.page1_cloud3} src={cloud3} alt="" />
      <img className={styles.page1_cloud4} src={cloud4} alt="" />

      <iframe
        className={styles.youtubeFrame}
        width="888"
        height="500"
        src="https://www.youtube.com/embed/y3DNIn2Q_1k"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default WelcomePageOne;
