import React, { useState } from "react";

import { RiArrowGoBackLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import styles from "./Tutorial.module.css";
import {
  IMG1,
  IMG2,
  IMG3,
  IMG4,
  IMG5,
  IMG6,
  IMG7,
  IMG8,
} from "../../assets/tutorial";
import Slider from "react-slick";
const Tutorial = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const images = [
    {
      v: IMG1,
      text1:
        "우측 하단에 내 방 만들기로 방을 만들거나, 개설된 라이브 방에 참여합니다.",
      text2:
        "혹시 방만들기 버튼이 보이지 않거나, 목록이 비어있으면 스크롤을 내리고 조금만 기다려주세요.",
    },
    {
      v: IMG2,
      text1: "방 이름을 입력하고 입장합니다.",
      text2: "확인을 눌렀을 때 반응이 없으면, 새로고침을 해주세요.",
    },
    {
      v: IMG3,
      text1: "제시어를 입력하기 전까지 아무나 그림을 그릴 수 있습니다.",
      text2: "이 때 그려진 그림은 저장되지 않습니다.",
    },
    {
      v: IMG4,
      text1:
        "제시어가 생성된 이후에는 캔버스가 초기화되며 호스트만 그림을 그릴 수 있습니다.",
      text2:
        "참가자들은 채팅으로 정답을 맞추며, 맞춘 사람은 정답자 채팅으로만 채팅을 할 수 있습니다.",
    },
    {
      v: IMG5,
      text1:
        "호스트는 그림을 모두 그리고 나면 제출 버튼을 눌러 제한 시간을 시작합니다.",
      text2: "제한 시간은 0초가 되더라도 다시 부여할 수 있습니다.",
    },
    {
      v: IMG6,
      text1:
        "제한 시간에 도달하면 민팅 여부를 묻는 화면이 제시됩니다. 이 때, 정답자가 있다면 정보가 저장됩니다.",
      text2: "취소를 누르고 제시어를 다시 입력하면 새로운 리드미를 시작합니다.",
    },
    {
      v: IMG7,
      text1:
        "민팅 페이지에서는 민팅여부를 확인하고 메타마스크로 민팅을 진행합니다.",
      text2: "네트워크 환경에 따라 긴 시간이 소요될 수 있습니다.",
    },
    {
      v: IMG8,
      text1:
        "민팅이 완료되고 나면 NFT 목록에서 본인의 리드미를 확인할 수 있습니다.",
      text2: "민팅 및 원본 이미지를 읽는데 약간의 시간이 소요될 수 있습니다.",
    },
  ];
  const navigate = useNavigate();
  const setting = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToshow: 1,
    slidesToScroll: 1,
    beforeChange: (current: any, next: any) => setActiveSlide(next),
  };
  return (
    <div
      className={styles.container}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === "space")
          setActiveSlide(activeSlide + 1);
      }}
    >
      <button
        className={styles.backArrow}
        onClick={() => {
          navigate("/");
        }}
      >
        <RiArrowGoBackLine />
        <p>돌아가기</p>
      </button>
      <Slider className={styles.slider} {...setting}>
        {images.map((item: any, i: number) => {
          return (
            <div className={styles.content} key={i}>
              <img className={styles.img} src={item.v} alt={`${item.v}`} />
              <p className={styles.text}>
                {item.text1}
                <br />
                {item.text2}
              </p>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default Tutorial;
