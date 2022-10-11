import { current } from "@reduxjs/toolkit";
import axios from "axios";
import { result } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { MintReadmeContract, MintReadMeContractGO, SaleReadmeContract, SaleReadmeContractGO } from "../../web3Config";
import { selectIsSSAFY, selectUserAddress } from "../auth/authSlice";
import styles from "./NftSaleList.module.css";
import NftSaleListItem from "./NftSaleListItem";
import tiger from "../../assets/characters/gold_tiger.svg";
import loadingStyles from "components/loading/Loading.module.css";
import loadingImg from "assets/loading/loading_page.gif";
import LoadingPage from "components/loading/LoadingPage";
import { createImportSpecifier } from "typescript";

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
  const [isDecrease, setIsDecrease] = useState(false);
  const [inputMinPrice, setInputMinPrice] = useState("");
  const [inputMaxPrice, setInputMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [hideInfo, setHideInfo] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigator = useNavigate();
  const isSSAFY = useAppSelector(selectIsSSAFY);

  const getAllListTokens = async () => {
    setLoading(true);
    try {
      const response = isSSAFY
        ? await MintReadmeContract.methods.getTotalReadmeToken().call()
        : await MintReadMeContractGO.methods.getTotalReadmeToken().call();
      const promises = response.map(async (e: any) => {
        const tokenUrl = isSSAFY ? await MintReadmeContract.methods.tokenURI(e).call() : await MintReadMeContractGO.methods.tokenURI(e).call();
        const nftPrice = isSSAFY
          ? await SaleReadmeContract.methods.getReadmeTokenPrice(e).call()
          : await SaleReadmeContractGO.methods.getReadmeTokenPrice(e).call();
        const data: IMyMintList = {
          tokenId: e,
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
        return data;
      });
      const results = await Promise.all(promises);

      setAllList(results);
      setLoading(false);
      setHideInfo(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const filterData = () => {
    if (!isOnSale && inputMaxPrice === "" && inputMinPrice === "") {
      // 판매중인 리스트
      console.log("전체");
      setFilteredList(allList);
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
    setIsIncrease(false);
    filteredList.sort((a: IMyMintList, b: IMyMintList): number => Number(b.price) - Number(a.price));
    console.log(filteredList);
    setFilteredList([...filteredList]);
  };

  const getIncreasedList = () => {
    setIsDecrease(false);
    filteredList.sort((a: IMyMintList, b: IMyMintList): number => Number(a.price) - Number(b.price));
    console.log(filteredList);
    setFilteredList([...filteredList]);
  };

  const sortedReset = () => {
    setIsIncrease(false);
    setIsDecrease(false);
    getAllListTokens();
  };

  const PriceReset = () => {
    setInputMinPrice("");
    setInputMaxPrice("");
    getAllListTokens();
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
    <div className={styles.saleContainer}>
      <div className={hideInfo ? `${styles.back} ${styles.hideInfo}` : `${styles.back}`}>
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
              <input type="checkbox" id="category_title1" />
              <label htmlFor="category_title1">
                Status<em></em>
              </label>

              <div className={styles.category_contents}>
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
            </div>
            <div className={styles.category_container}>
              <input type="checkbox" id="category_title2" />
              <label htmlFor="category_title2">
                Sort<em></em>
              </label>
              <div className={styles.category_contents_sort}>
                <div className={styles.category_price_select}>
                  <input
                    type="radio"
                    id="sortedByIncrease"
                    name="sortedBy"
                    onChange={getIncreasedList}
                    checked={isIncrease}
                    onClick={() => setIsIncrease(!isIncrease)}
                  />
                  <label htmlFor="sortedByIncrease">가격 낮은 순</label>
                </div>
                <div className={styles.category_price_select}>
                  <input
                    type="radio"
                    id="sortedByDecrease"
                    name="sortedBy"
                    onChange={getDecreasedList}
                    checked={isDecrease}
                    onClick={() => setIsDecrease(!isDecrease)}
                  />
                  <label htmlFor="sortedByDecrease">가격 높은 순</label>
                </div>
                <button className={styles.category_button_reset} onClick={sortedReset}>
                  초기화
                </button>
              </div>
            </div>
            <div className={styles.category_container}>
              <input type="checkbox" id="category_title3" />
              <label htmlFor="category_title3">
                Price<em></em>
              </label>
              <div className={styles.category_contents_price}>
                <div className={styles.category_price_range}>
                  <input ref={inputRef} type="text" name="inputMinMax" value={inputMinPrice} onChange={handleInputMinPrice} placeholder="최저가" />
                  <div className={styles.category_price_range_text}>to</div>
                  <input ref={inputRef} type="text" name="inputMinMax" value={inputMaxPrice} onChange={handleInputMaxPrice} placeholder="최고가" />
                </div>
                <div>
                  <button className={styles.category_button} onClick={filterData}>
                    찾기
                  </button>
                  <button className={styles.category_button_reset} onClick={PriceReset}>
                    초기화
                  </button>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingPage msg="리드미를 불러오는 중이에요!" />
          ) : (
            <div className={styles.nftListContainer}>
              {filteredList.map((nft: IMyMintList, i: number) => {
                return <NftSaleListItem key={i} nft={nft} />;
              })}
            </div>
          )}
        </div>
      </div>
      {/* <div style={{ height: "50px" }}></div> */}
    </div>
  );
};

export default NftSaleList;
