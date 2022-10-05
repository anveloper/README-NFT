import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { selectUserAddress } from "../auth/authSlice";
import styles from "./NftDetail.module.css";
import { selectIsActive, selectNftDetail, selectNftOwner, selectNftPrice, setIsActive, setNftDetail, setNftOwner, setNftPrice } from "./NftDetailSlice";
import { truncatedAddress } from "../../features/auth/authSlice";
import { change_date } from "../../features/auth/authSlice";
import NftDetailCard from "./components/NftDetailCard";
import NftDetailInfo from "./NftDetailInfo";
import BackgroundFlower from "../../components/BackgroundFlower";
import NftSell from "./NftSell";
import { Modal } from "../../components/modal/Modal";

const NftDetail = () => {
  const dispatch = useAppDispatch();

  const { tokenId } = useParams();
  const nftDetail = useAppSelector(selectNftDetail);
  const nftPrice = useAppSelector(selectNftPrice);
  const nftOwner = useAppSelector(selectNftOwner);
  const userAddress = useAppSelector(selectUserAddress);
  const [tab, setTab] = useState("info");

  const getMetadata = async () => {
    try {
      const response = await MintReadmeContract.methods.tokenURI(tokenId).call();
      await axios({ url: response })
        .then((data: any) => {
          dispatch(setNftDetail(data.data));
        })
        .catch((error: any) => {
          console.error(error);
        });
    } catch (err) {
      console.error(err);
    }
  };

  const getNftInfo = async () => {
    try {
      const nftPrice = await SaleReadmeContract.methods.getReadmeTokenPrice(tokenId).call();
      const nftOwner = await MintReadmeContract.methods.ownerOf(tokenId).call();
      dispatch(setNftPrice(nftPrice));
      dispatch(setNftOwner(nftOwner));
    } catch (error) {
      console.error(error);
    }
  };

  // mount
  useEffect(() => {
    getMetadata();
    getNftInfo();
  }, []);

  return (
    // <div className={styles.sell_background}>
    //   <BackgroundFlower />
    <div className={styles.detail}>
      <div className={styles.detail_container}>
        <NftDetailCard tokenId={tokenId} nftDetail={nftDetail} nftPrice={nftPrice} nftOwner={nftOwner} />
        {
          {
            info: <NftDetailInfo tokenId={tokenId} nftDetail={nftDetail} nftPrice={nftPrice} nftOwner={nftOwner} userAddress={userAddress} setTab={setTab} />,
            sell: <NftSell />,
          }[tab]
        }
      </div>
    </div>
    // </div>
  );
};

export default NftDetail;
