import React from "react";

import { ReactComponent as Cloud1 } from "../../assets/carousel/carousel_cloud01.svg";
import { ReactComponent as Cloud2 } from "../../assets/carousel/carousel_cloud02.svg";
import { ReactComponent as Plane1 } from "../../assets/carousel/plane01.svg";
import { ReactComponent as Plane2 } from "../../assets/carousel/plane02.svg";
import CarouselSwiper from "./components/CarouselSwiper";

import styles from "./Main.module.css";
const Carousel = () => {
  return (
    <div className={styles.carouselContainer}>
      <CarouselSwiper />
      <Cloud1 className={styles.rightCloud} />
      <Cloud2 className={styles.leftCloud} />
      <Plane1 className={styles.leftPlane} />
      <Plane2 className={styles.rightPlane} />
    </div>
  );
};

export default Carousel;
