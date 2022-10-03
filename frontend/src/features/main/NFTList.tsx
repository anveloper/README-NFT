import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  NftConfig,
  selectNftList,
  selectRawList,
  setNftList,
} from "../nft/nftSlice";
import NftItem from "../../components/nftItem/NftItem";

import styles from "./Main.module.css";

const NFTList = () => {
  const rawList = useAppSelector(selectRawList);
  const nftList = useAppSelector(selectNftList);
  const lastRef = useRef<HTMLButtonElement | null>(null);
  const [itemCnt, setItemCnt] = useState(8);
  const dispatch = useAppDispatch();
  // mount
  useEffect(() => {
    return () => {
      setItemCnt(8);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // tokent raw data -> token data
  useEffect(() => {
    if (rawList && rawList.length > 0) {
      const result: NftConfig[] = [];
      const cnt = Math.min(rawList.length, itemCnt);
      for (let i = 0; i < cnt; i++) {
        const {
          metaDataURI,
          readmeTokenId,
          readmeTokenOwner,
          readmeTokenPrice,
          isActive,
        } = rawList[rawList.length - 1 - i];
        if (metaDataURI.length < 69)
          // 임시방편
          result.push({
            metaDataURI,
            readmeTokenId,
            readmeTokenOwner,
            readmeTokenPrice,
            metaData: undefined,
            isActive,
            // saleDate: undefined, // (정현) NftConfig 수정해서 넣었어욧
          });
      }
      dispatch(setNftList(result));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawList, itemCnt]);

  return (
    <div className={styles.container}>
      <div className={styles.listContainer}>
        <div className={styles.nftSearch}>
          {/* <input type="text" placeholder="검색어를 입력해주세요." /> */}
        </div>
        {nftList?.map((nft: NftConfig, i: number) => {
          if (i === nftList.length - 1)
            return <NftItem lastRef={lastRef} key={i} nft={nft} />;
          return <NftItem key={i} nft={nft} />;
        })}
        {rawList && rawList.length > itemCnt && (
          <div className={styles.moreBtn}>
            <button onClick={() => setItemCnt(itemCnt + 4)}>더 보기</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NFTList;
