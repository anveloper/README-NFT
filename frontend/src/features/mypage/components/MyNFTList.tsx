import { FC, useEffect, useRef, useState } from "react";
import { GetReadmeContract, MintReadmeContract } from "../../../web3Config";
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
  const [selected, setSelected] = useState("");
  const [NFTCardArray, setNFTCardArray] = useState<IMyNFTCard[]>([]);
  const [cardList, setCardList] = useState(true);
  const [nftList, setNftList] = useState([]);

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
      setNFTCardArray([]);
      setNFTCardArray(tempNFTCardArray);
      setCardList(true);
    } catch (error) {
      setCardList(false);
    }
  };

  const likeNFTList = async () => {
    const tempNFTCardArray: IMyNFTCard[] = [];

    axios
      .get(api.like.likeNFTList(walletAddress))
      .then(async (response) => {
        if (response.data.count !== 0) {
          for (let i = 0; i < response.data.nfts.length; i++) {
            const tokenInfo = await MintReadmeContract.methods
              .tokenURI(response.data.nfts[i])
              .call();
            tempNFTCardArray[i].readmeTokenId = response.data.nfts[i];
            tempNFTCardArray[i].metaDataURI = tokenInfo;
            tempNFTCardArray[i].readmeTokenOwner = null;
            tempNFTCardArray[i].readmeTokenOwner = null;
          }

          setNFTCardArray([]);
          setNFTCardArray(tempNFTCardArray);
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
      setNFTCardArray([]);
      setNFTCardArray(tempNFTCardArray);
      setCardList(true);
    } catch (error) {
      setCardList(false);
    }
  };

  const handleSelect = (e: any) => {
    setSelected(e.target.value);
  };

  const getNFTName = async (metadataURI: string) => {
    let name: any = "";
    try {
      await axios({ url: metadataURI }).then((response) => {
        name = response.data.name;
        console.log("name : ", name);
        return name;
      });
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

  useEffect(() => {
    console.log("값 변경");
    const sortNFTList = () => {
      console.log("NFTCardArray : ", NFTCardArray);
      if (selected === "latest") {
        NFTCardArray.sort((a, b) => {
          return parseInt(b.readmeTokenId) - parseInt(a.readmeTokenId);
        });
        setNFTCardArray([...NFTCardArray]);
      }
      if (selected === "name") {
        // const name = async (metaDataURI: string) => {
        //   try {
        //     return await getNFTName(metaDataURI);
        //   } catch (error) {
        //     console.error(error);
        //   }
        // };
        NFTCardArray.sort((a, b) => {
          console.log("a : ", a);
          console.log("b : ", b);
          let a_name = "";
          let b_name = "";
          axios({ url: a.metaDataURI }).then((response) => {
            a_name = response.data.name;
            console.log("a_name : ", a_name);
          });
          axios({ url: b.metaDataURI }).then((response) => {
            b_name = response.data.name;
            console.log("b_name : ", a_name);
          });
          // name(a.metaDataURI).then((res: any) => {
          //   a_name = res;
          //   console.log("res : ", res);
          //   console.log("a_name : ", a_name);
          // });
          // name(b.metaDataURI).then((res: any) => {
          //   b_name = res;
          //   console.log("b_name : ", b_name);
          // });
          // let a_name = name(a.metaDataURI);
          // let b_name = name(b.metaDataURI);
          // console.log("a name : ", name(a.metaDataURI));
          // console.log("b name : ", b_name);
          if (a_name < b_name) {
            console.log("NFTCARDARRAY : ", NFTCardArray);
            return 1;
          } else if (a_name > b_name) {
            console.log("return -1 / CardArray", NFTCardArray);
            return -1;
          }
          return 0;
        });
        console.log("NFTCARD", NFTCardArray);
        setNFTCardArray([...NFTCardArray]);
      }
    };
    sortNFTList();
  }, [selected]);

  return (
    <div className={styles.MyNFTList}>
      {cardList ? (
        <select name="sort" value={selected} onChange={handleSelect}>
          <option value="default">Sort</option>
          <option value="latest">최신순</option>
          <option value="name">이름순</option>
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
            <img
              className={styles.giraffe_palette}
              src={giraffe_palette}
              alt=""
            />
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
            <img
              className={styles.giraffe_palette}
              src={giraffe_palette}
              alt=""
            />
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
