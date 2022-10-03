import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { selectUserAddress } from "../auth/authSlice";
import styles from "./NftSaleList.module.css";
import NftSaleListItem from "./NftSaleListItem";

interface IMyMintList {
  tokenId: number;
  fileName: string;
  name: string;
  author: string;
  description: string;
  imageURL: string;
  onSale: boolean;
  price: number;
}

const NftSaleList = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const [allList, setAllList] = useState<IMyMintList[]>([]);
  const [saleList, setSaleList] = useState<IMyMintList[]>([]);
  const [isOnSale, setIsOnSale] = useState(false);
  const [inputMinPrice, setInputMinPrice] = useState(0);
  const [inputMaxPrice, setInputMaxPrice] = useState(0);
  const [sortedList, setSortedList] = useState<IMyMintList[]>([]);
  const [checkedList, setCheckedList] = useState([]); // 뱃지 리스트
  const [priceFilter, setPriceFilter] = useState("noPriceFilter");
  const navigator = useNavigate();

  const getAllListTokens = async () => {
    try {
      const response = await MintReadmeContract.methods.getTotalReadmeToken().call();
      const tmpAllList: IMyMintList[] = [];
      const tmpSaleList: IMyMintList[] = [];
      for (let i = 0; i < response.length; i++) {
        const tokenUrl = await MintReadmeContract.methods.tokenURI(response[i]).call();
        const nftPrice = await SaleReadmeContract.methods.getReadmeTokenPrice(response[i]).call();
        const data: IMyMintList = {
          tokenId: response[i],
          fileName: "",
          name: "",
          author: "",
          description: "",
          imageURL: "",
          onSale: false,
          price: 0,
        };
        await axios(tokenUrl).then((res: any) => {
          data.fileName = res.data.fileName;
          data.name = res.data.name;
          data.author = res.data.author;
          data.description = res.data.description;
          data.imageURL = res.data.imageURL;
          data.onSale = nftPrice === "0" ? false : true; // false -> 미판매, true -> 판매
          data.price = nftPrice;
        });
        if (data.onSale) tmpSaleList.push(data); // 판매리스트 따로 생성
        tmpAllList.push(data);
      }
      setAllList(tmpAllList);
      setSaleList(tmpSaleList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputMinPrice = (e: any) => {
    setInputMinPrice(e.target.value);
  };

  const handleInputMaxPrice = (e: any) => {
    setInputMaxPrice(e.target.value);
  };

  const tmpSortedList: IMyMintList[] = isOnSale ? saleList : allList;
  const getSortedList = (type: string) => {
    console.log(type);
    if (type === "increase") {
      tmpSortedList.sort((a, b) => (a.price > b.price ? -1 : 1));
    } else if (type === "decrease") {
      tmpSortedList.sort((a, b) => (a.price < b.price ? -1 : 1));
    }
    setSortedList(tmpSortedList);
  };

  const getPriceBetween = () => {};

  useEffect(() => {
    getAllListTokens();
    console.log("isOnSale 상태가 바뀔 때마다 리렌더링");
  }, [isOnSale]);

  return (
    <>
      <div className={styles.back}>
        <div className={styles.top_info}>
          {/* <img src={market_back} alt="" /> */}
          <div className={styles.top_info_text}>
            <div className={styles.top_info_h2}>리드미 마켓</div>
            <div className={styles.top_info_p}>기발한 아이디어의 리드미를 발견했나요?</div>
            <div className={styles.top_info_p}>지금 리드미를 구매해보세요!</div>
          </div>
        </div>
      </div>
      <div className={styles.back}>
        <div className={styles.container}>
          <div className={styles.contents}>
            <div>--판매 여부--</div>
            <input
              type="checkbox"
              id="isOnSale"
              onChange={(e) => {
                setIsOnSale(!isOnSale);
              }}
            />
            <label htmlFor="isOnSale">판매중</label>
            <div>--가격 정렬--</div>
            <label htmlFor="inputMin">최저</label>
            <input type="number" name="inputMin" value={inputMinPrice} onChange={handleInputMinPrice} />
            <label htmlFor="inputMax">최고</label>
            <input type="number" name="inputMax" value={inputMaxPrice} onChange={handleInputMaxPrice} />
            <div>{inputMinPrice}</div> 부터 <div>{inputMaxPrice}</div>
            <button onClick={getPriceBetween}>찾기</button>
            <button onClick={() => getSortedList("increase")}>가격 높은 순</button>
            <button onClick={() => getSortedList("decrease")}>가격 낮은 순</button>
          </div>
          <div className={styles.contents}>
            <div className={styles.badge}>
              <div style={{ marginRight: "10px" }}></div>
              {/* <div onClick={deleteBadge}>X</div> */}
            </div>
            <div>{{ priceFilter: <></>, sortByLowPrice: <></>, sortByHighPrice: <></> }[priceFilter]}</div>
            {isOnSale ? (
              <>
                {saleList.map((nft: IMyMintList, i: number) => {
                  return <NftSaleListItem key={i} nft={nft} />;
                })}
              </>
            ) : (
              <>
                {allList.map((v: IMyMintList) => {
                  return (
                    <div className={styles.card_container} key={v.tokenId} onClick={() => navigator("/detail/" + v.tokenId)}>
                      <div className={styles.card}>
                        <div className={styles.img_sq}>
                          <img className={styles.img} src={v.imageURL} alt="NFT이미지" width={300} />
                        </div>
                        <div>가격: {v.price}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NftSaleList;
