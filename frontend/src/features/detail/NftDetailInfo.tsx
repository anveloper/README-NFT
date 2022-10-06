import styles from "./NftDetail.module.css";
import { useNavigate } from "react-router-dom";
import {
  GetReadmeContract,
  GetReadmeContractGO,
  MintReadmeContract,
  SaleReadmeContract,
  SSFContract,
  web3,
} from "../../web3Config";
import { useDispatch } from "react-redux";
import { selectIsActive, setIsActive, setNftPrice } from "./NftDetailSlice";
import { Modal } from "../../components/modal/Modal";
import { useEffect, useContext, useState } from "react";
import { useAppSelector } from "app/hooks";
import {
  change_date,
  selectIsSSAFY,
  selectUserAddress,
} from "features/auth/authSlice";
import axios from "axios";
import { IMyNFTCard } from "features/mypage/components/MyNFTCard";
import { url } from "inspector";

export interface nftTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

interface nftCreator {
  readmeTokenId: string;
  metaDataURI: string;
}

interface nftTokenImg {
  readmeTokenId: string;
  imageURL: string;
}

const NftDetailInfo = (props: any) => {
  const { nftOwner, tokenId, nftDetail, nftPrice } = props;
  const userAddress = useAppSelector(selectUserAddress);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(Object);
  const [nftEndTime, setNftEndTime] = useState<nftTime>({
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isReady, setIsReady] = useState(false);
  const [request, setRequest] = useState("");
  const [creator, setCreator] = useState("");
  const [nftCreatorList, setNftCreatorList] = useState<nftTokenImg[]>([]);
  const isAvail = useAppSelector(selectIsActive);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSSAFY = useAppSelector(selectIsSSAFY);
  const getTimeInfo = async () => {
    const response = await SaleReadmeContract.methods
      .readmeTokenEndTime(tokenId)
      .call();
    await SaleReadmeContract.methods
      .parseTimestamp(response)
      .call((err: any, res: any) => {
        const nftEndTime: nftTime = {
          year: Number(res.year),
          month: Number(res.month),
          day: Number(res.day),
          hour: Number(res.hour),
          minute: Number(res.minute),
          second: Number(res.second),
        };
        setNftEndTime(nftEndTime);
        setEndDate(
          new Date(
            nftEndTime.year,
            nftEndTime.month - 1,
            nftEndTime.day,
            nftEndTime.hour,
            nftEndTime.minute,
            nftEndTime.second
          )
        );
        setIsReady(true);
      });
  };

  const getCreatorReadme = async () => {
    // 1. creator 가져온다.
    const response = await MintReadmeContract.methods
      .getMetadata(tokenId)
      .call();
    console.log(response);
    await axios({ url: response })
      .then((res: any) => {
        const { author } = res.data;
        setCreator(author);
        console.log(creator);
      })
      .catch((err) => {});

    // 2. creator가 그린 그림 가져온다.
    const metaReq = isSSAFY
      ? await GetReadmeContract.methods.getDrawReadmeToken(creator).call()
      : await GetReadmeContractGO.methods.getDrawReadmeToken(creator).call();
    const tmpMetaList: nftCreator[] = [];
    const tmpNftCreatorList: nftTokenImg[] = [];
    metaReq.map((v: nftCreator) => {
      console.log(v);
      tmpMetaList.push({
        readmeTokenId: v.readmeTokenId,
        metaDataURI: v.metaDataURI,
      });
    });

    tmpMetaList.map(async (v: any) => {
      console.log(v);
      await axios({ url: v.metaDataURI })
        .then((res: any) => {
          console.log(res);
          tmpNftCreatorList.push({
            readmeTokenId: v.readmeTokenId,
            imageURL: res.data.imageURL,
          });
        })
        .catch((err: any) => {
          console.log(err);
        });
    });

    setNftCreatorList(tmpNftCreatorList);
    console.log(nftCreatorList);
  };

  const cancelSale = async () => {
    // 종료 기간 내에서, 판매되지 않은 리드미 판매 취소하기
    try {
      console.log("여기 cancelReadmeToken");
      await SaleReadmeContract.methods
        .cancelReadmeToken(tokenId)
        .send({ from: userAddress })
        .then((res: any) => {
          console.log(res);
          // 새로고침 해야 가격 갱신됨. 부자연스러울 수 있을듯. 방법 강구.
          window.location.replace("/detail/" + tokenId);
          dispatch(setIsActive(false));
        })
        .catch((err: any) => {
          console.log(err);
          alert("cancelReadmeToken 에러.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const refundSale = async () => {
    // 종료 기간이 지나고 판매되지 않은 리드미 판매 취소하기
    try {
      console.log("여기 refundsReadmeToken");
      await SaleReadmeContract.methods
        .refundsReadmeToken(tokenId)
        .send({ from: userAddress })
        .then((res: any) => {
          console.log("종료 이후에 판매 취소: ", res);
          dispatch(setIsActive(false));
        })
        .catch((err: any) => {
          console.log(err);
          alert("refundsReadmeToken 에러.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const buyNftToken = async () => {
    let balance = 0;
    await SSFContract.methods
      .balanceOf(userAddress)
      .call((err: any, res: any) => {
        balance = res;
      });
    console.log(balance);
    if (balance >= nftPrice) {
      await SSFContract.methods
        .approve(process.env.REACT_APP_SALEREADMETOKEN_CA, nftPrice)
        .send({ from: userAddress })
        .then((res: any) => {
          console.log("approve : ", res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      await SaleReadmeContract.methods
        .purchaseReadmeToken(process.env.REACT_APP_ERC20_CA, tokenId)
        .send({ from: userAddress })
        .then((res: any) => {
          console.log(res);
          // 새로고침.
          navigate("/deatil/" + tokenId);
          // window.location.replace("/detail/" + tokenId);
          console.log("purchase : ", res);
        })
        .catch((err: any) => {
          console.log(err);
        });
    } else {
      alert("잔액이 부족합니다.");
    }
  };

  const openBuyModal = () => {
    setBuyModalOpen(true);
  };

  const closeBuyModal = () => {
    setBuyModalOpen(false);
  };

  const openCancelModal = (req: string) => {
    console.log("구매 가능?", isAvail);
    console.log("리퀘스트: ", request);
    setCancelModalOpen(true);
    setRequest(req);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
  };

  const moveToBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    getTimeInfo();
    return () => {
      dispatch(setIsActive(true));
    };
  }, [nftDetail]);

  useEffect(() => {
    getCreatorReadme();
  }, [isReady]);

  /* 카운트다운 구현 (성진님감사합니다쌍따봉드림) */
  useEffect(() => {
    const timeDiff = +endDate - +new Date();
    let timeLeft = {};
    const countDown = setInterval(() => {
      if (isReady && timeDiff > 0) {
        timeLeft = {
          days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timeDiff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((timeDiff / 1000 / 60) % 60),
          seconds: Math.floor((timeDiff / 1000) % 60),
        };
        setTimeLeft(timeLeft);
      }
      if (timeDiff <= 0) {
        dispatch(setIsActive(false));
      }
    }, 1000);
    return () => clearInterval(countDown);
  }, [isReady, timeLeft, endDate]);

  return (
    <>
      <div className={styles.cards}>
        <div className={styles.card_contents_back}>
          <div className={styles.card_contents_back_info}>
            <div className={styles.card_contents_back_info_child}>
              판매 정보
            </div>
            <div className={styles.card_contents_back_info_child}>
              {isAvail && nftPrice !== "0" ? (
                <>
                  <div className={styles.card_contents_text1}>
                    판매중인 리드미입니다.
                  </div>
                  <div>
                    <div>
                      {timeLeft.days}일 {timeLeft.hours}시간 {timeLeft.minute}분{" "}
                      {timeLeft.seconds}초 후에 종료됩니다.
                    </div>
                    <div className={styles.card_contents_text2}>
                      ({change_date(endDate)})
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "18px", marginTop: "5px" }}>❌</div>
                  <div>
                    <div className={styles.card_contents_text3}>
                      판매 상태가 아닙니다.
                    </div>
                    <div className={styles.card_contents_text3}>
                      소유자가 판매 상태를 관리할 때까지
                    </div>
                    <div className={styles.card_contents_text3}>
                      구매가 제한됩니다.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className={styles.card_contents_back_info}>
            <div className={styles.card_contents_back_info_child}>
              창작자가 그린 다른 그림
            </div>
            <div className={styles.card_another_container}>
              {nftCreatorList ? (
                <>
                  <div className={styles.card_another_images}>
                    {nftCreatorList.map((v: any, i: number) => {
                      console.log(v.metaDataURI);
                      return (
                        <img
                          className={styles.card_another_image}
                          src={v.imageURL}
                          alt=""
                          key={i}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.card_another_noImages}>
                    <div>창작자가 그린 그림이 없어요.</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.card_contents_back_info}>
            <div className={styles.card_buttons}>
              <button className={styles.card_button} onClick={moveToBack}>
                이전
              </button>

              <div>
                {nftOwner.toLowerCase() === userAddress ? (
                  <>
                    {nftPrice !== "0" ? (
                      <>
                        {isAvail ? (
                          <>
                            <button
                              className={styles.card_button}
                              onClick={() => openCancelModal("cancel")}
                            >
                              판매 취소 (기간 내)
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className={styles.card_button}
                              onClick={() => openCancelModal("refund")}
                            >
                              판매 취소 (기간 외)
                            </button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          className={styles.card_button}
                          onClick={() => props.setTab("sell")}
                        >
                          판매 등록
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      disabled={!isAvail}
                      className={styles.card_button}
                      onClick={openBuyModal}
                    >
                      즉시 구매
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={buyModalOpen}
        close={closeBuyModal}
        fn={buyNftToken}
        header="리드미 구매 확인"
      >
        <div className={styles.modal_container}>
          <img className={styles.modal_img} src={nftDetail.imageURL} alt="" />
          <div className={styles.modal_info_container}>
            <div className={styles.modal_info}>
              <div className={styles.modal_info_text1}>
                <div>제목</div>
                <div>{nftDetail.name}</div>
              </div>
              <div className={styles.modal_info_text1}>
                <div>가격</div>
                <div>{nftPrice} SSF</div>
              </div>
            </div>
            <div className={styles.modal_info}>
              <div className={styles.modal_info_text2}>
                <div>구매하시겠습니까?</div>
              </div>
              <div className={styles.modal_info_text2}>
                <div>확인 버튼을 누르시면 구매가 완료됩니다.</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={cancelModalOpen}
        close={closeCancelModal}
        fn={() => {
          request === "cancel" ? cancelSale() : refundSale();
        }}
        header="리드미 판매 취소 확인"
      >
        <div className={styles.modal_info}>
          <div className={styles.modal_info_text2}>
            <div>판매를 취소하시겠습니까?</div>
          </div>
          <div></div>
          <div className={styles.modal_info_text2}>
            <div>확인 버튼을 누르시면 판매 취소가 완료됩니다.</div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default NftDetailInfo;
