import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import styles from "./NFTSlider.module.css";
import IMG from "../../../assets/dumy_horse.png";
const images: string[] = [IMG, IMG, IMG, IMG, IMG, IMG, IMG];

const NFTSlider = () => {
  const [imageIndex, setImageIndex] = useState(0);
  const settings = {
    infinite: true,
    speed: 300,    
    slidesToShow: 3,
    centerMode: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current: number, next: number) => setImageIndex(next),
  };
  const handleList = () => {
    const result = [];
    for (let i = 0; i < images.length; i++) {
      result.push(
        <div
          key={i}
          className={
            i === imageIndex
              ? `${styles.slide} ${styles.activeSlide}`
              : styles.slide
          }
        >
          <img src={images[i]} alt={images[i]} />
          <p>{i}번째 더미 말</p>
        </div>
      );
    }
    return result;
  };
  return (
    <>
      <Slider {...settings}>{handleList()}</Slider>
    </>
  );
};

export default NFTSlider;

const NextArrow = ({ onClick }: any) => {
  return (
    <div className={`${styles.arrow} ${styles.next}`} onClick={onClick}>
      <FaArrowRight />
    </div>
  );
};

const PrevArrow = ({ onClick }: any) => {
  return (
    <div className={`${styles.arrow} ${styles.prev}`} onClick={onClick}>
      <FaArrowLeft />
    </div>
  );
};
