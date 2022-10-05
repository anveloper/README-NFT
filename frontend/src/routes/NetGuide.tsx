import { useNavigate } from "react-router-dom";
import styles from "./NetGuide.module.css";
import cloud1 from "assets/welcome/page3_cloud1.svg";
import cloud2 from "assets/welcome/page3_cloud2.svg";
const NetGuide = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.welcomePageThree}>
      <h1 className={styles.WelcomeTitleText}>싸피네트워크 추가하기</h1>
      <h4 className={styles.WelcomeDescriptionText}>게임에 관한 설명 텍스트</h4>
      <img className={styles.page3_cloud1} src={cloud1} alt="" />
      <img className={styles.page3_cloud2} src={cloud2} alt="" />
      <img className={styles.page3_gameDisplay} alt="" />
      <button
        onClick={() => {
          navigate(`/`);
        }}
      >
        돌아가기
      </button>
    </div>
  );
};

export default NetGuide;
