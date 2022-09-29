import { FC, useEffect, useRef, useState } from "react";
import { GetReadmeContract } from "../../../web3Config";
import { useAppSelector } from "../../../app/hooks";
import { selectUserAddress } from "../../auth/authSlice";
import axios from "axios";
import api from "../../../api/api";
// components
import MyNFTCard, { IMyNFTCard } from "./MyNFTCard";
// css
import styles from "../MyPage.module.css";
// img
import dog_palette from "../../../assets/nft-img/1.png";
import cat_palette from "../../../assets/nft-img/2.png";
import giraffe_palette from "../../../assets/nft-img/3.png";
import flower1 from "../../../assets/flowers/flower1.svg";
import flower2 from "../../../assets/flowers/flower2.svg";
import flower3 from "../../../assets/flowers/flower3.svg";
import flower4 from "../../../assets/flowers/flower4.svg";
import sprout1 from "../../../assets/flowers/sprout1.svg";
import sprout2 from "../../../assets/flowers/sprout2.svg";

interface MyNFTListProps {
  NFTListValue: any;
}

const MyNFTList: FC<MyNFTListProps> = ({ NFTListValue }) => {
  const walletAddress = useAppSelector(selectUserAddress);
  const [NFTCardArray, setNFTCardArray] = useState<IMyNFTCard[]>([]);
  const [cardList, setCardList] = useState(true);

  const scrollBox = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollActive, setScrollActive] = useState(false);

  const logit = () => {
    setScrollY(scrollBox.current.scrollTop);
    if (scrollBox.current.scrollTop > 30) {
      setScrollActive(true);
    } else {
      setScrollActive(false);
    }
  };
  // const [pageNum, setPageNum] = useState(1);
  // const observerRef = useRef();

  // const observer = new IntersectionObserver(callback, options);

  const myNFTList = async () => {
    try {
      const tempNFTCardArray: IMyNFTCard[] = [];

      const response = await GetReadmeContract.methods.getMyReadmeToken(walletAddress).call();
      console.log(response);

      response.map((v: IMyNFTCard) => {
        tempNFTCardArray.push({
          readmeTokenId: v.readmeTokenId,
          readmeTokenPrice: v.readmeTokenPrice,
          readmeTokenOwner: v.readmeTokenOwner,
          metaDataURI: v.metaDataURI,
        });
      });
      setNFTCardArray([]);
      setNFTCardArray(tempNFTCardArray);
      setCardList(true);
    } catch (error) {
      setCardList(false);
    }
  };

  const likeNFTList = async () => {
    axios
      .get(api.like.likeNFTList(walletAddress))
      .then((response) => {
        if (response.data.count !== 0) {
          setCardList(true);
          console.log(response);
        } else {
          setCardList(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createNFTList = async () => {
    try {
      const tempNFTCardArray: IMyNFTCard[] = [];

      const response = await GetReadmeContract.methods.getDrawReadmeToken(walletAddress).call();
      console.log(response);

      response.map((v: IMyNFTCard) => {
        tempNFTCardArray.push({
          readmeTokenId: v.readmeTokenId,
          readmeTokenPrice: v.readmeTokenPrice,
          readmeTokenOwner: v.readmeTokenOwner,
          metaDataURI: v.metaDataURI,
        });
      });
      console.log("card : ", tempNFTCardArray);
      setNFTCardArray([]);
      setNFTCardArray(tempNFTCardArray);
      setCardList(true);
    } catch (error) {
      setCardList(false);
    }
  };

  useEffect(() => {
    if (NFTListValue === "myNFT") {
      myNFTList();
    } else if (NFTListValue === "likeNFT") {
      likeNFTList();
    } else if (NFTListValue === "createNFT") {
      createNFTList();
    }
  }, [NFTListValue]);

  useEffect(() => {
    const watchScroll = () => {
      scrollBox.current.addEventListener("scroll", logit);
    };
    watchScroll();
    return () => {
      // scrollBox.current.removeEventListener("scroll", logit);
    };
  });

  return (
    <div className={styles.MyNFTList}>
      {cardList ? (
        <select name="" id="">
          <option value="sort">Sort</option>
          <option value="">이름순</option>
          <option value="">가격순</option>
        </select>
      ) : (
        <div></div>
      )}

      <div className={styles.MyNFTCardListScrollBox} ref={scrollBox}>
        {cardList ? (
          <div className={styles.MyNFTCardList}>
            {NFTCardArray.map((v, i) => {
              return (
                <MyNFTCard
                  key={i}
                  readmeTokenId={v.readmeTokenId}
                  readmeTokenPrice={v.readmeTokenPrice}
                  readmeTokenOwner={v.readmeTokenOwner}
                  metaDataURI={v.metaDataURI}
                />
              );
            })}
          </div>
        ) : NFTListValue === "likeNFT" ? (
          <div className={styles.noCardList}>
            <img className={styles.dog_palette} src={dog_palette} alt="" />
            <img className={styles.flower1} src={flower1} alt="" />
            <img className={styles.flower2} src={flower2} alt="" />
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>

            <div className={styles.noticeBox}>
              <p className={styles.noticeText}>
                찜한 리드미가 없어요! <br />
                마켓에서 마음에 드는 리드미를 골라보세요!
                <br />
              </p>
              <button className={styles.movePageButton}>마켓으로 이동</button>
            </div>
            <img className={styles.cat_palette} src={cat_palette} alt="" />
            <img className={styles.giraffe_palette} src={giraffe_palette} alt="" />
            <img className={styles.flower3} src={flower3} alt="" />
            <img className={styles.flower4} src={flower4} alt="" />
            <img className={styles.sprout1} src={sprout1} alt="" />
            <img className={styles.sprout2} src={sprout2} alt="" />
            <div className={styles.circle3}></div>
            <div className={styles.circle4}></div>
            <div className={styles.circle5}></div>
          </div>
        ) : (
          <div className={styles.noCardList}>
            <img className={styles.dog_palette} src={dog_palette} alt="" />
            <img className={styles.flower1} src={flower1} alt="" />
            <img className={styles.flower2} src={flower2} alt="" />
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>

            <div className={styles.noticeBox}>
              <p className={styles.noticeText}>
                아직 리드미가 없어요! <br />
                게임을 통해 리드미를 얻어보세요! <br />
              </p>
              <button className={styles.movePageButton}>게임하러 가기</button>
            </div>
            <img className={styles.cat_palette} src={cat_palette} alt="" />
            <img className={styles.giraffe_palette} src={giraffe_palette} alt="" />
            <img className={styles.flower3} src={flower3} alt="" />
            <img className={styles.flower4} src={flower4} alt="" />
            <img className={styles.sprout1} src={sprout1} alt="" />
            <img className={styles.sprout2} src={sprout2} alt="" />
            <div className={styles.circle3}></div>
            <div className={styles.circle4}></div>
            <div className={styles.circle5}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTList;
