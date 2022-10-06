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
import copyIcon from "assets/guide/copy.svg";

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

  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {}
  };

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
              <div style={{ display: "flex", justifyContent: "center" }}>
                Network name &nbsp; : &nbsp; SSAFY Network &nbsp;
                <img
                  style={{ cursor: "pointer" }}
                  src={copyIcon}
                  alt=""
                  onClick={() => handleCopyClipBoard("SSAFY Network")}
                />
              </div>
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                New RPC URL &nbsp; : &nbsp; http://20.196.209.2:8545 &nbsp;
                <img
                  style={{ cursor: "pointer" }}
                  src={copyIcon}
                  alt=""
                  onClick={() =>
                    handleCopyClipBoard("http://20.196.209.2:8545")
                  }
                />
              </div>
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                Chain ID &nbsp; :&nbsp; 31221 &nbsp;
                <img
                  style={{ cursor: "pointer" }}
                  src={copyIcon}
                  alt=""
                  onClick={() => handleCopyClipBoard("31221")}
                />
              </div>
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                Currency symbol&nbsp; :&nbsp; ETH &nbsp;
                <img
                  style={{ cursor: "pointer" }}
                  src={copyIcon}
                  alt=""
                  onClick={() => handleCopyClipBoard("ETH")}
                />
              </div>
            </h4>
          </div>
        </div>

        <div className={styles.sliderDiv}>
          <div className={styles.sliderImgDiv}>
            <img className={styles.guide5} src={guide5} alt="" />
          </div>
          <div className={styles.sliderTextDiv}>
            <h4 className={styles.sliderEndText}>
              리드미에서는 SSAFY 토큰을 사용합니다! <br /> <br />
              웰컴 페이지에서 'SSF 추가하기'를 클릭하면 등록이 완료됩니다!
            </h4>
            <button
              className={styles.moveWelcome}
              onClick={() => navigate("/")}
            >
              웰컴페이지로 이동
            </button>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default NetGuide;
