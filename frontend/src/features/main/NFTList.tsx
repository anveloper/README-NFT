import React, { useEffect, Suspense, lazy } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { GetReadmeContract } from "../../web3Config";
import { NftConfig, selectNftList, setNftList } from "../nft/nftSlice";
import styles from "./Main.module.css";
import NftItem from "../../components/nftItem/NftItem";

// const NftItem = lazy(() => import("../../components/nftItem/NftItem"));

const NFTList = () => {
  const nftList = useAppSelector(selectNftList);
  const dispatch = useAppDispatch();
  useEffect(() => {
    GetReadmeContract.methods.getTotalToken().call((err: any, res: any) => {
      console.log(res);
      if (res && res.length > 0) {
        const result: NftConfig[] = [];
        res.map((r: any) => {
          const {
            metaDataURI,
            readmeTokenId,
            readmeTokenOwner,
            readmeTokenPrice,
          } = r;
          result.push({
            metaDataURI,
            readmeTokenId,
            readmeTokenOwner,
            readmeTokenPrice,
            metaData: undefined,
          });
        });
        dispatch(setNftList(result));
      }
    });
  }, []);
  return (
    <div className={styles.listContainer}>
      {nftList.map((nft: NftConfig, i: number) => {
        return (
          <div key={i}>
            <div>tokenID: {nft.readmeTokenId}</div>
            <div>PRICE: {nft.readmeTokenPrice}</div>
            <div>OWNER: {nft.readmeTokenOwner}</div>
            <div>URI: {nft.metaDataURI}</div>
            <div>metaData</div>
            <NftItem metaDataURI={nft.metaDataURI} />
          </div>
        );
      })}
    </div>
  );
};

export default NFTList;
