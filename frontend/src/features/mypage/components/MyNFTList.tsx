import { FC, useEffect, useRef, useState } from "react";
// components
import MyNFTCard, { IMyNFTCard } from "./MyNFTCard";
// css
import styles from "../MyPage.module.css";
import { GetReadmeContract } from "../../../web3Config";
import { useAppSelector } from "../../../app/hooks";
import { selectUserAddress } from "../../auth/authSlice";
import axios from "axios";
import api from "../../../api/api";

interface MyNFTListProps {
  NFTListValue: any;
}

const MyNFTList: FC<MyNFTListProps> = ({ NFTListValue }) => {
  const walletAddress = useAppSelector(selectUserAddress);
  const [NFTCardArray, setNFTCardArray] = useState<IMyNFTCard[]>([]);

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

      const response = await GetReadmeContract.methods
        .getMyReadmeToken(walletAddress)
        .call();
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
    } catch (error) {
      console.error(error);
    }
  };

  const likeNFTList = async () => {
    axios
      .get(api.like.likeNFTList(walletAddress))
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createNFTList = async () => {
    try {
      const tempNFTCardArray: IMyNFTCard[] = [];

      const response = await GetReadmeContract.methods
        .getDrawReadmeToken(walletAddress)
        .call();
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
      setNFTCardArray(tempNFTCardArray);
    } catch (error) {
      console.error(error);
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
      <select name="" id="">
        <option value="sort">Sort</option>
        <option value="">이름순</option>
        <option value="">가격순</option>
      </select>

      <div className={styles.MyNFTCardListScrollBox}>
        <div className={styles.MyNFTCardList} ref={scrollBox}>
          {NFTCardArray &&
            NFTCardArray.map((v, i) => {
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
          {/* <div ref={observer}></div> */}
        </div>
      </div>
    </div>
  );
};

export default MyNFTList;
