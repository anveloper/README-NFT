import React from "react";
// Import Swiper styles
import styles from "../Main.module.css";
import NFTSlider from "./NFTSlider";
const CarouselSwiper = () => {
  return (
    <div className={styles.carouselWapper}>
      <div className={styles.carouselContent}>
        <NFTSlider />
      </div>
    </div>
  );
};

export default CarouselSwiper;
