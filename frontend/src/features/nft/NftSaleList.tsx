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
import tiger from "../../assets/characters/gold_tiger.svg";

interface IMyMintList {
  tokenId: number;
  fileName: string;
  name: string;
  author: string;
  description: string;
  imageURL: string;
  onSale: boolean;
  price: string;
}

const NftSaleList = () => {
  const [allList, setAllList] = useState<IMyMintList[]>([]);
  const [filteredList, setFilteredList] = useState<IMyMintList[]>([]);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isIncrease, setIsIncrease] = useState(false);
  const [inputMinPrice, setInputMinPrice] = useState("");
  const [inputMaxPrice, setInputMaxPrice] = useState("");
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
          price: "",
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
        tmpAllList.push(data);
      }
      setAllList(tmpAllList);
    } catch (error) {
      console.log(error);
    }
  };

  const filterData = () => {
    if (!isOnSale && inputMaxPrice === "" && inputMinPrice === "") {
      // 판매중인 리스트
      console.log("전체");
      setFilteredList(allList);
      console.log(allList);
    } else {
      console.log("조건문");
      let init: IMyMintList[] = [];
      const result = allList.reduce((acc, cur) => {
        const saleCondition = isOnSale ? parseInt(cur.price) !== 0 : true;
        const priceMinCondition = inputMinPrice !== "" ? parseInt(cur.price) >= Number(inputMinPrice) : true;
        const priceMaxCondition = inputMaxPrice !== "" ? parseInt(cur.price) <= Number(inputMaxPrice) : true;
        if (saleCondition && priceMinCondition && priceMaxCondition) {
          acc.push(cur);
        }
        return acc;
      }, init);
      setFilteredList(result);
    }
  };

  const getDecreasedList = () => {
    filteredList.sort((a: IMyMintList, b: IMyMintList): number => Number(b.price) - Number(a.price));
    console.log(filteredList);
    setFilteredList([...filteredList]);
  };

  const getIncreasedList = () => {
    filteredList.sort((a: IMyMintList, b: IMyMintList): number => Number(a.price) - Number(b.price));
    console.log(filteredList);
    setFilteredList([...filteredList]);
  };

  const handleInputMinPrice = (e: any) => {
    setInputMinPrice(e.target.value);
  };

  const handleInputMaxPrice = (e: any) => {
    setInputMaxPrice(e.target.value);
  };

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
          <img className={styles.top_info_img} src={tiger} width={200} alt="" />
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
                  name="isOnSale"
                  onChange={(e) => {
                    setIsOnSale(!isOnSale);
                  }}
                />
                <label htmlFor="isOnSale" className={styles.category_isOnSale_text} />
                <div className={styles.category_isOnSale_text}>판매중 리드미 모아보기</div>
              </div>
            </div>
            <div className={styles.category_container}>
              <div className={styles.category_title}>가격 정렬</div>
              <div className={styles.category_price_sort}>
                <button className={styles.category_button} onClick={getDecreasedList}>
                  가격 높은 순
                </button>
                <button className={styles.category_button} onClick={getIncreasedList}>
                  가격 낮은 순
                </button>
              </div>
            </div>
            <div className={styles.category_container}>
              <div className={styles.category_title}>가격대 찾기</div>
              <div className={styles.category_price_range}>
                <input type="text" name="inputMin" defaultValue={inputMinPrice} onChange={handleInputMinPrice} placeholder="최저가" />
                <div className={styles.category_price_range_text}>to</div>
                <input type="text" name="inputMax" defaultValue={inputMaxPrice} onChange={handleInputMaxPrice} placeholder="최고가" />
                <button className={styles.category_button} style={{ backgroundColor: "#fddf61" }} onClick={filterData}>
                  찾기
                </button>
              </div>
            </div>
          </div>
          <div>
            {filteredList.map((nft: IMyMintList, i: number) => {
              return <NftSaleListItem key={i} nft={nft} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default NftSaleList;
