import { current } from "@reduxjs/toolkit";
import axios from "axios";
import { result } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
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
  const [allList, setAllList] = useState<IMyMintList[]>([]);
  const [filteredList, setFilteredList] = useState<IMyMintList[]>([]);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isAvail, setIsAvail] = useState(false);
  const [inputMinPrice, setInputMinPrice] = useState(0);
  const [inputMaxPrice, setInputMaxPrice] = useState(0);
  const [sortedList, setSortedList] = useState<IMyMintList[]>([]);
  const [checkedList, setCheckedList] = useState([]); // 뱃지 리스트
  const navigator = useNavigate();

  const getAllListTokens = async () => {
    try {
      const response = await MintReadmeContract.methods.getTotalReadmeToken().call();
      const tmpAllList: IMyMintList[] = [];
      // const tmpSaleList: IMyMintList[] = [];
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

        // if (data.onSale) tmpSaleList.push(data); // 판매리스트 따로 생성
        tmpAllList.push(data);
      }
      // if (isOnSale) {
      //   setDisplayList(tmpSaleList);
      // } else setDisplayList(tmpAllList);
      setAllList(tmpAllList);
      // setSaleList(tmpSaleList);
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = () => {
    if (!isOnSale && inputMaxPrice === 0 && inputMinPrice === 0) {
      // 판매중인 리스트
      console.log("전체");
      setFilteredList(allList);
    } else {
      console.log("조건문");
      console.log(inputMinPrice);
      let init: IMyMintList[] = [];
      const result = allList.reduce((acc, cur) => {
        const saleCondition = isOnSale ? cur.price !== 0 : true;
        const priceMinCondition = inputMinPrice != null ? cur.price >= inputMinPrice : true;
        // const priceMaxCondition = inputMaxPrice != null ? cur.price <= inputMaxPrice : true;
        console.log(saleCondition);

        if (saleCondition && priceMinCondition) {
          console.log(cur.price);
          acc.push(cur);
        }
        // console.log(inputMinPrice);
        // if (cur.price > inputMinPrice) {
        //   acc.push(cur);
        // }
        return acc;
      }, init);
      setFilteredList(result);
    }
  };

  const handleInputMinPrice = (e: any) => {
    setInputMinPrice(e.target.value);
  };

  const handleInputMaxPrice = (e: any) => {
    setInputMaxPrice(e.target.value);
  };

  // const getSortedList = (type: string) => {
  //   console.log(type);
  //   if (type === "increase") {
  //     displayList.sort((a, b) => (a.price > b.price ? -1 : 1));
  //   } else if (type === "decrease") {
  //     displayList.sort((a, b) => (a.price < b.price ? -1 : 1));
  //   }
  //   setSortedList(displayList);
  // };

  useEffect(() => {
    getAllListTokens();

    console.log("isOnSale 상태가 바뀔 때마다 리렌더링");
  }, [isOnSale]);

  useEffect(() => {
    filterData();
  }, [allList]);

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
            <div className={styles.category_container}>
              <div className={styles.category_title}>판매 상태</div>
              <div className={styles.category_isOnSale}>
                <input
                  type="checkbox"
                  id="isOnSale"
                  onChange={(e) => {
                    setIsOnSale(!isOnSale);
                  }}
                />
                <label htmlFor="isOnSale" className={styles.category_isOnSale_text} />
                <div className={styles.category_isOnSale_text}>판매중</div>
              </div>
            </div>
            <div className={styles.category_container}>
              <div className={styles.category_title}>가격 정렬</div>
              {/* <div className={styles.category_price_sort}>
                <button className={styles.category_button} onClick={() => getSortedList("increase")}>
                  가격 높은 순
                </button>
                <button className={styles.category_button} onClick={() => getSortedList("decrease")}>
                  가격 낮은 순
                </button>
              </div> */}
            </div>
            <div className={styles.category_container}>
              <div className={styles.category_title}>가격대 찾기</div>
              <div className={styles.category_price_range}>
                <input type="text" name="inputMin" defaultValue={inputMinPrice} onChange={handleInputMinPrice} placeholder="최저가" />
                <div className={styles.category_price_range_text}>to</div>
                <input type="text" name="inputMax" defaultValue={inputMaxPrice} onChange={handleInputMaxPrice} placeholder="최고가" />
              </div>
              <button className={styles.category_button} style={{ backgroundColor: "#fddf61" }} onClick={filterData}>
                찾기
              </button>
            </div>
          </div>
          <div className={styles.contents}>
            <div className={styles.badge}>
              <div style={{ marginRight: "10px" }}>설정값</div>
              {/* <div onClick={deleteBadge}>X</div> */}
            </div>
            <div>
              {filteredList.map((nft: IMyMintList, i: number) => {
                return <NftSaleListItem key={i} nft={nft} />;
              })}
            </div>

            {/* {displayList.map((nft: IMyMintList, i: number) => {
              // return <NftSaleListItem key={i} nft={nft} />;
              return <div>{{ priceFilter: <></>, sortByLowPrice: <></>, sortByHighPrice: <></> }[priceFilter]}</div>;
            })} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default NftSaleList;
