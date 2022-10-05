import { useNavigate } from "react-router-dom";
import styles from "./NetGuide.module.css";
import cloud1 from "assets/welcome/page3_cloud1.svg";
import cloud2 from "assets/welcome/page3_cloud2.svg";
import g_1 from "assets/guide-img/g_1.jpg";
import g_2 from "assets/guide-img/g_2.jpg";
import g_3 from "assets/guide-img/g_3.jpg";
import g_4 from "assets/guide-img/g_4.jpg";

import Slider from "react-slick";
import { useState } from "react";
const NetGuide = () => {
  const navigate = useNavigate();
  const setting = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToshow: 1,
    slidesToScroll: 1,
    beforeChange: (current: any, next: any) => setActiveSlide(next),
  };
  const [activeSlide, setActiveSlide] = useState(0);
  const guides = [
    `크롬 오른쪽 상단 Extensions에서 Metamask를 실행해 주세요.`,
    "팝업 상단을 클릭하여 네트워크 추가 하기를 선택해 주세요.",
    "아래 내용을 입력 후, 저장 해주세요.",
    "Readme에서는 SSF토큰을 사용합니다! 웰컴 페이지에서 SSF토큰을 지갑에 불러와 주세요",
  ];
  return (
    <div className={styles.welcomePageThree}>
      <h1 className={styles.WelcomeTitleText}>싸피네트워크 추가하기</h1>
      <img className={styles.page3_cloud1} src={cloud1} alt="" />
      <img className={styles.page3_cloud2} src={cloud2} alt="" />
      <Slider className={styles.slider} {...setting}>
        <img src={g_1} alt="" />
        <img src={g_2} alt="" />
        <img src={g_3} alt="" />
        <img src={g_4} alt="" />
      </Slider>
      <div className={styles.textBox}>
        <h4 className={styles.WelcomeDescriptionText}>{guides[activeSlide]}</h4>
      </div>
      {/* <button
        onClick={() => {
          navigate(`/`);
        }}
      >
        돌아가기
      </button> */}
    </div>
  );
};

export default NetGuide;
