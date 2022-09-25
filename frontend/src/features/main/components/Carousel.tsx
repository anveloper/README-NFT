import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GetReadmeContract } from "../../../web3Config";
import {
  NftConfig,
  selectNftList,
  selectRawList,
  setNftList,
  setRawList,
} from "../../nft/nftSlice";
import CarouselItem from "../../../components/nftItem/CarouselItem";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from "./Carousel.module.css";

const Carousel = () => {
  const rawList = useAppSelector(selectRawList);
  const nftList = useAppSelector(selectNftList);
  const dispatch = useAppDispatch();
  // mount
  useEffect(() => {
    GetReadmeContract.methods.getTotalToken().call((err: any, res: any) => {
      dispatch(setRawList(res));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (rawList && rawList.length > 0) {
      const result: NftConfig[] = [];
      const cnt = Math.min(rawList.length, 10);
      for (let i = 0; i < cnt; i++) {
        const {
          metaDataURI,
          readmeTokenId,
          readmeTokenOwner,
          readmeTokenPrice,
        } = rawList[i];
        result.push({
          metaDataURI,
          readmeTokenId,
          readmeTokenOwner,
          readmeTokenPrice,
          metaData: undefined,
        });
      }
      dispatch(setNftList(result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawList]);
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
    <div className={styles.carouselContainer}>
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
          {nftList.map((nft: NftConfig, i: number) => {
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
