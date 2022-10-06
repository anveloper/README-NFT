import { useNavigate } from "react-router-dom";
// css
import styles from "./NetGuide.module.css";
// img
import guidebook from "assets/guide/guidebook.svg";
import guide1 from "assets/guide/guide1.svg";
import guide2 from "assets/guide/guide2.svg";
import guide3 from "assets/guide/guide3.svg";
import guide4 from "assets/guide/guide4.svg";
import guide5 from "assets/guide/guide5.svg";

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
    <div className={styles.NetGuide}>
      <img className={styles.guidebook} src={guidebook} alt="" />
      <Slider className={styles.slider} {...setting}>
        <div className={styles.sliderDiv}>
          <div className={styles.sliderImgDiv}>
            <img className={styles.guide1} src={guide1} alt="" />
          </div>
          <div className={styles.sliderTextDiv}>
            <h4 className={styles.sliderText}>
              ① Chrome 오른쪽 상단 확장 프로그램을 열어주세요. <br /> <br /> ②
              Metamask를 실행해 주세요.
            </h4>
          </div>
        </div>

        <div className={styles.sliderDiv}>
          <div className={styles.sliderImgDiv}>
            <img className={styles.guide2} src={guide2} alt="" />
          </div>
          <div className={styles.sliderTextDiv}>
            <h4 className={styles.sliderText}>
              Metamask 팝업 상단 네트워크를 클릭해주세요.
            </h4>
          </div>
        </div>

        <div className={styles.sliderDiv}>
          <div className={styles.sliderImgDiv}>
            <img className={styles.guide3} src={guide3} alt="" />
          </div>
          <div className={styles.sliderTextDiv}>
            <h4 className={styles.sliderText}>
              네트워크 목록 하단 'Add network' 버튼을 클릭해주세요.
            </h4>
          </div>
        </div>

        <div className={styles.sliderDiv}>
          <div className={styles.sliderImgDiv}>
            <img className={styles.guide4} src={guide4} alt="" />
          </div>
          <div className={styles.sliderTextDiv}>
            <h4 className={styles.sliderText}>
              아래 내용을 입력 후 저장해주세요. <br /> <br /> <br />
              <br />
              Network name &nbsp; : &nbsp; SSAFY Network
              <br /> <br />
              New RPC URL &nbsp; : &nbsp; http://20.196.209.2:8545 <br />
              <br />
              Chain ID &nbsp; :&nbsp; 31221 <br />
              <br />
              Currency symbol&nbsp; :&nbsp; ETH
              <br />
            </h4>
          </div>
        </div>

        <div className={styles.sliderDiv}>
          <div className={styles.sliderImgDiv}>
            <img className={styles.guide5} src={guide5} alt="" />
          </div>
          <div className={styles.sliderTextDiv}>
            <h4 className={styles.sliderText}>
              리드미에서는 SSAFY 토큰을 사용합니다! <br /> <br />
              웰컴 페이지에서 'SSF 추가하기'를 클릭하면 등록이 완료됩니다!
            </h4>
          </div>
        </div>
      </Slider>
      {/* <div className={styles.textBox}></div> */}
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
