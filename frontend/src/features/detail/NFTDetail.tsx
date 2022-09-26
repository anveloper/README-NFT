import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { selectUserAddress } from "../auth/authSlice";
import styles from "./NftDetail.module.css";
import { selectNftDetail, setNftDetail } from "./NftDetailSlice";

const NftDetail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { tokenId } = useParams();
  const nftDetail = useAppSelector(selectNftDetail);
  const userAddress = useAppSelector(selectUserAddress);
  const [nftPrice, setNftPrice] = useState(0);
  const [nftOwner, setNftOwner] = useState("");

  const getMetadata = async() => {
    try {
      const response = await MintReadmeContract.methods.tokenURI(tokenId).call();
      await axios({url: response})
      .then((data: any) => {
        dispatch(setNftDetail(data.data));
      }).catch((error: any) => {
          console.error(error);
      });
    } catch (err) {
      console.error(err)
    }
  }
  const getNftInfo = async () => {
    try {
      const nftPrice = await SaleReadmeContract.methods.getReadmeTokenPrice(tokenId).call();
      const nftOwner = await MintReadmeContract.methods.ownerOf(tokenId).call();
      setNftPrice(nftPrice)
      setNftOwner(nftOwner);
    } catch (error) {
      console.error(error);
    }
  }

  // mount
  useEffect(() => {
    getMetadata();
    getNftInfo();
  }, [])
  

  return (
    <div className={styles.detail}>
      <div className={styles.detail_container}>
        <div className={styles.cards}>
          <div className={styles.card_contents_front}>
            <img className={styles.card_img} src={nftDetail.imageURL} alt="dog" />
            <div className={styles.card_img_info}>
              <p>TokenID: {tokenId}</p>
              <p>FileName: {nftDetail.fileName}</p>
              <p>Creator: {nftDetail.author}</p>
              <p>Owner: {nftOwner}</p>
            </div>
          </div>
        </div>
        <div className={styles.cards}>
          <div className={styles.card_contents_back}>
            <div className={styles.card_contents_back_price}>
              <div>
                <p>현재 가격</p>
                <p>{nftPrice} SSF</p>
              </div>
              <div>
                { nftOwner.toLowerCase() === userAddress ? <>
                  <button className={styles.card_button} onClick={() => navigate("/sell")}>
                  판매
                </button>
                </> : <>
                <button className={styles.card_button} onClick={() => navigate("/sell")}>
                  구매
                </button></>
                  
                }
              </div>
            </div>
            <div className={styles.card_contents_back_history}></div>
            <div className={styles.card_buttons}>
              <button className={styles.card_button}>이전</button>
              <button className={styles.card_button}>경매 참여</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetail;
