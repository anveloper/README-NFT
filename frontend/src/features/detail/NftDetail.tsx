import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { selectUserAddress } from "../auth/authSlice";
import styles from "./NftDetail.module.css";
import { selectNftDetail, setNftDetail } from "./NftDetailSlice";
import { truncatedAddress } from "../../features/auth/authSlice";

const NftDetail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { tokenId } = useParams();
  const nftDetail = useAppSelector(selectNftDetail);
  const userAddress = useAppSelector(selectUserAddress);
  const [nftPrice, setNftPrice] = useState(0);
  const [nftOwner, setNftOwner] = useState("");

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
      setNftPrice(nftPrice);
      setNftOwner(nftOwner);
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
    <div className={styles.detail}>
      <div className={styles.detail_container}>
        <div className={styles.cards}>
          <div className={styles.card_contents_front}>
            <img className={styles.card_contents_front_child} src={nftDetail.imageURL} alt="dog" />
            <div className={styles.card_contents_front_child}>
              <div className={styles.card_img_info_child}>
                <div>Token ID</div>
                <div>{tokenId}</div>
              </div>
              <div className={styles.card_img_info_child}>
                <div>FileName</div>
                <div>{nftDetail.name}</div>
              </div>
              <div className={styles.card_img_info_child}>
                <div>Creator</div>
                <div>{truncatedAddress(nftDetail.author)}</div>
              </div>
              <div className={styles.card_img_info_child}>
                <div>Owner</div>
                <div>{truncatedAddress(nftOwner)}</div>
              </div>
            </div>
            <div className={styles.card_contents_front_child}>
              <div>현재 가격</div>
              <div>{nftPrice} SSF</div>
            </div>
          </div>
        </div>
        <div className={styles.cards}>
          <div className={styles.card_contents_back}>
            <div className={styles.card_contents_back_info}>
              <div className={styles.card_contents_back_info_child}>
                <div>판매가&nbsp;</div>
                <div style={{ fontSize: "18px", color: "#21658F" }}>2022년 10월 7일</div>
                <div>&nbsp;종료됩니다.</div>
              </div>
              <div className={styles.card_contents_back_info_child}>
                <div style={{ fontSize: "22px" }}>2일 21시간 12분 2초</div>
              </div>
            </div>
            <div className={styles.card_contents_back_info}>
              어떻게 구성해야 할지 고민인 창. 구매 버튼 활성화 되긴 함.
              <div>
                {nftOwner.toLowerCase() === userAddress ? (
                  <>
                    <button className={styles.card_button} onClick={() => navigate("/sell/" + tokenId)}>
                      판매
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.card_button} onClick={() => navigate("/sell/" + tokenId)}>
                      구매
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className={styles.card_contents_back_info}>
              <div className={styles.card_buttons}>
                <button className={styles.card_button}>이전</button>
                <button className={styles.card_button}>경매 참여</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetail;
