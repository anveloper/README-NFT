import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";

// state
import {
  NftConfig,
  selectCarouselList,
  selectRawList,
  selectSolveList,
  setCarouselList,
} from "../../nft/nftSlice";

// components
import CarouselItem from "../../../components/nftItem/CarouselItem";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Slider from "react-slick";

// css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Carousel.module.css";

const Carousel = ({ carouselRef }: any) => {
  const rawList = useAppSelector(selectRawList);
  const carouselList = useAppSelector(selectCarouselList);
  const solveList = useAppSelector(selectSolveList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (rawList && rawList.length > 0) {
      const result: NftConfig[] = [];
      let cnt = Math.min(rawList.length, 10);
      for (let i = 0; i < cnt; i++) {
        const {
          metaDataURI,
          readmeTokenId,
          readmeTokenOwner,
          readmeTokenPrice,
          isActive,
        } = rawList[rawList.length - 1 - i];
        if (!solveList.includes(Number(readmeTokenId)))
          // 임시방편
          result.push({
            metaDataURI,
            readmeTokenId,
            readmeTokenOwner,
            readmeTokenPrice,
            metaData: undefined,
            isActive,
            //saleDate: undefined, // (정현) NftConfig 수정해서 넣었어욧
          });
        else if (cnt < rawList.length - 1) cnt++;
      }
      dispatch(setCarouselList(result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawList, solveList]);
  const [imageIndex, setImageIndex] = useState(0);
  const settings = {
    // infinite: true,
    // centerMode: true,
    speed: 300,
    slidesToShow: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    beforeChange: (current: number, next: number) => setImageIndex(next),
  };
  return (
    <div className={styles.carouselContainer} ref={carouselRef}>
      <div className={styles.carouselInfo}>
        <p className={styles.carouselTitle}>한 번 맞춰볼래?</p>
        <p className={styles.carouselDescription}>
          이미 발급된 [리드미] 퀴즈를 풀어볼 수 있습니다.
          <br />
          정답을 맞추고, 갖고 싶은 리드미를 거래하세요.
        </p>
      </div>
      <div>
        <Slider {...settings}>
          {carouselList.map((nft: NftConfig, i: number) => {
            return (
              <div
                key={i}
                className={
                  i === imageIndex
                    ? `${styles.slide} ${styles.activeSlide}`
                    : styles.slide
                }
              >
                <CarouselItem nft={nft} metaDataURI={nft.metaDataURI} />
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;

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
