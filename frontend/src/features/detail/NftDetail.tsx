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

const NftDetail = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { tokenId } = useParams();
  const nftDetail = useAppSelector(selectNftDetail);
  const nftPrice = useAppSelector(selectNftPrice);
  const nftOwner = useAppSelector(selectNftOwner);
  const isActive = useAppSelector(selectIsActive);
  const userAddress = useAppSelector(selectUserAddress);

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
      const isActive = await SaleReadmeContract.methods.getIsActive(tokenId).call();
      dispatch(setIsActive(isActive));
      dispatch(setNftPrice(nftPrice));
      dispatch(setNftOwner(nftOwner));
    } catch (error) {
      console.error(error);
    }
  };

  /* 에러남. */
  const cancelSale = async () => {
    if (window.confirm("정말 판매 등록 취소?")) {
      try {
        await SaleReadmeContract.methods
          .cancelReadmeToken(tokenId)
          .call()
          .then((res: any) => {
            console.log(res);
            alert("판매 취소가 완료되었습니다.");
            dispatch(setIsActive(false));
          })
          .catch((err: any) => {
            console.log(err);
            alert("에러남.");
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const moveToBack = () => {
    navigate(-1);
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
              {nftPrice.toString() === "0" ? <div>판매 미등록</div> : <div>{nftPrice} SSF</div>}
            </div>
          </div>
        </div>
        <div className={styles.cards}>
          <div className={styles.card_contents_back}>
            <div className={styles.card_contents_back_info}>
              <div className={styles.card_contents_back_info_child}>
                {isActive ? (
                  <>
                    <div>판매 중입니다.</div>
                    <div>즉시 구매하시거나, 경매에 참여할 수 있습니다.</div>
                  </>
                ) : (
                  // <>
                  //   <div>판매가&nbsp;</div>
                  //   {/* <div style={{ fontSize: "18px", color: "#21658F" }}>{change_date(saleDate.saleEndDay)}</div> */}
                  //   <div>&nbsp;종료됩니다.</div>
                  // </>
                  <>
                    <div>판매 상태가 아닙니다.&nbsp;</div>
                    <div>구매가 제한됩니다.</div>
                  </>
                )}
              </div>
            </div>
            <div className={styles.card_contents_back_info}>
              <div>여기다가 경매 관련된걸 넣으면 좋겠는데요</div>
              <button className={styles.card_button}>경매 참여</button>
            </div>

            <div className={styles.card_contents_back_info}>
              <div className={styles.card_buttons}>
                <button className={styles.card_button} onClick={moveToBack}>
                  이전
                </button>
                <div>
                  {nftOwner.toLowerCase() === userAddress ? (
                    <>
                      {isActive ? (
                        <>
                          <button className={styles.card_button} onClick={cancelSale}>
                            판매 취소
                          </button>
                        </>
                      ) : (
                        <>
                          <button className={styles.card_button} onClick={() => navigate("/sell/" + tokenId)}>
                            즉시 판매
                          </button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <button className={styles.card_button} onClick={() => navigate("/sell/" + tokenId)} disabled>
                        즉시 구매
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftDetail;
