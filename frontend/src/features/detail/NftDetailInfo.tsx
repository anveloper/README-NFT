import styles from "./NftDetail.module.css";
import { useNavigate } from "react-router-dom";
import {
  GetReadmeContract,
  GetReadmeContractGO,
  MintReadmeContract,
  MintReadMeContractGO,
  SaleReadmeContract,
  SaleReadmeContractGO,
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
import LoadingSpinner from "components/loading/LoadingSpinner";
import LoadingPage from "components/loading/LoadingPage";

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
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
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
  const [countDownLoading, setCountDownLoading] = useState(true);
  const [createrNFTLoading, setCreaterNFTLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const isAvail = useAppSelector(selectIsActive);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSSAFY = useAppSelector(selectIsSSAFY);

  const getTimeInfo = async () => {
    setCountDownLoading(true);
    const response = isSSAFY
      ? await SaleReadmeContract.methods.readmeTokenEndTime(tokenId).call()
      : await SaleReadmeContractGO.methods.readmeTokenEndTime(tokenId).call();
    isSSAFY
      ? await SaleReadmeContract.methods
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
            setCountDownLoading(false);
          })
      : await SaleReadmeContractGO.methods
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
            setCountDownLoading(false);
          });
  };

  const getCreator = async () => {
    console.log("ready");
    // 1. creator ????????????.
    setCreaterNFTLoading(true);
    const response = isSSAFY
      ? await MintReadmeContract.methods.getMetadata(tokenId).call()
      : await MintReadMeContractGO.methods.getMetadata(tokenId).call();
    await axios({ url: response })
      .then((res: any) => {
        const { author } = res.data;
        setCreator(author);
      })
      .catch((err) => {});
    console.log("ready 1");
  };

  const getCreatorReadme = async () => {
    // 2. creator??? ?????? ?????? ????????????.
    const metaReq = isSSAFY
      ? await GetReadmeContract.methods.getDrawReadmeToken(creator).call()
      : await GetReadmeContractGO.methods.getDrawReadmeToken(creator).call();
    console.log("ready 2");
    const tmpMetaList: nftCreator[] = [];
    const tmpNftCreatorList: nftTokenImg[] = [];
    metaReq.map((v: nftCreator) => {
      tmpMetaList.push({
        readmeTokenId: v.readmeTokenId,
        metaDataURI: v.metaDataURI,
      });
    });

    tmpMetaList.map(async (v: any) => {
      await axios({ url: v.metaDataURI })
        .then((res: any) => {
          tmpNftCreatorList.push({
            readmeTokenId: v.readmeTokenId,
            imageURL: res.data.imageURL,
          });
        })
        .catch((err: any) => {
          console.log(err);
        });
    });
    console.log("ready 3");

    setNftCreatorList(tmpNftCreatorList);
    setCreaterNFTLoading(false);
  };

  const cancelSale = async () => {
    // ?????? ?????? ?????????, ???????????? ?????? ????????? ?????? ????????????
    try {
      setLoading(true);
      console.log("?????? cancelReadmeToken");
      isSSAFY
        ? await SaleReadmeContract.methods
            .cancelReadmeToken(tokenId)
            .send({ from: userAddress })
            .then((res: any) => {
              console.log(res);
              // ???????????? ?????? ?????? ?????????. ?????????????????? ??? ?????????. ?????? ??????.
              window.location.replace("/detail/" + tokenId);
              dispatch(setIsActive(false));
            })
            .catch((err: any) => {
              console.log(err);
              alert("cancelReadmeToken ??????.");
            })
        : await SaleReadmeContractGO.methods
            .cancelReadmeToken(tokenId)
            .send({ from: userAddress })
            .then((res: any) => {
              console.log(res);
              // ???????????? ?????? ?????? ?????????. ?????????????????? ??? ?????????. ?????? ??????.
              window.location.replace("/detail/" + tokenId);
              dispatch(setIsActive(false));
            })
            .catch((err: any) => {
              console.log(err);
              alert("cancelReadmeToken ??????.");
            });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const refundSale = async () => {
    // ?????? ????????? ????????? ???????????? ?????? ????????? ?????? ????????????
    try {
      setLoading(true);
      console.log("?????? refundsReadmeToken");
      isSSAFY
        ? await SaleReadmeContract.methods
            .refundsReadmeToken(tokenId)
            .send({ from: userAddress })
            .then((res: any) => {
              console.log("?????? ????????? ?????? ??????: ", res);
              dispatch(setIsActive(false));
            })
            .catch((err: any) => {
              console.log(err);
              alert("refundsReadmeToken ??????.");
            })
        : await SaleReadmeContractGO.methods
            .refundsReadmeToken(tokenId)
            .send({ from: userAddress })
            .then((res: any) => {
              console.log("?????? ????????? ?????? ??????: ", res);
              dispatch(setIsActive(false));
            })
            .catch((err: any) => {
              console.log(err);
              alert("refundsReadmeToken ??????.");
            });
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const buyNftToken = async () => {
    setLoading(true);
    let balance = "";
    await SSFContract.methods
      .balanceOf(userAddress)
      .call((err: any, res: string) => {
        balance = res;
      });
    console.log(typeof balance);
    console.log("NFT price : ", typeof nftPrice);

    if (parseInt(balance) >= parseInt(nftPrice)) {
      setLoadingStep(1);
      await SSFContract.methods
        .approve(process.env.REACT_APP_SALEREADMETOKEN_CA, nftPrice)
        .send({ from: userAddress })
        .then((res: any) => {
          console.log("approve : ", res);
        })
        .catch((err: any) => {
          console.log(err);
        });
      setLoadingStep(2);
      isSSAFY
        ? await SaleReadmeContract.methods
            .purchaseReadmeToken(process.env.REACT_APP_ERC20_CA, tokenId)
            .send({ from: userAddress })
            .then((res: any) => {
              console.log(res);
              // ????????????.
              // navigate("/mypage");
              // window.location.replace("/detail/" + tokenId);
              console.log("purchase : ", res);
              openCompleteModal();
            })
            .catch((err: any) => {
              console.log(err);
            })
        : await SaleReadmeContractGO.methods
            .purchaseReadmeToken(process.env.REACT_APP_ERC20_CA, tokenId)
            .send({ from: userAddress })
            .then((res: any) => {
              console.log(res);
              // ????????????.
              // navigate("/deatil/" + tokenId);
              // window.location.replace("/detail/" + tokenId);
              console.log("purchase : ", res);
              openCompleteModal();
            })
            .catch((err: any) => {
              console.log(err);
            });
      setLoading(false);
      setBuyModalOpen(false);
    } else {
      // alert("????????? ???????????????.");
      openBalanceModal();
      setLoading(false);
    }
  };

  const openBuyModal = () => {
    setBuyModalOpen(true);
  };

  const closeBuyModal = () => {
    setBuyModalOpen(false);
  };

  const openCancelModal = (req: string) => {
    console.log("?????? ???????", isAvail);
    console.log("????????????: ", request);
    setCancelModalOpen(true);
    setRequest(req);
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
  };

  const openCompleteModal = () => {
    setCompleteModalOpen(true);
  };

  const openBalanceModal = () => {
    setBalanceModalOpen(true);
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
    console.log("??????");
    getCreator();
    getCreatorReadme();
  }, [creator]);

  /* ??????????????? ?????? (???????????????????????????????????????) */
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
      {loading ? (
        <LoadingPage
          msg={[
            `?????? ${loadingStep}/2 ?????? ?????????`,
            <br />,
            "??????????????? ???????????? ??????????????????!",
          ]}
        />
      ) : (
        <>
          <div className={styles.cards}>
            <div className={styles.card_contents_back}>
              <div className={styles.card_contents_back_info}>
                <div className={styles.card_contents_back_info_child}>
                  ?????? ??????
                </div>

                <div className={styles.card_contents_back_info_child}>
                  <>
                    {isAvail && nftPrice !== "0" ? (
                      <>
                        {countDownLoading ? (
                          <LoadingSpinner />
                        ) : (
                          <>
                            <div className={styles.card_contents_back_sale}>
                              <div style={{ fontSize: "16px", marginTop: "1px", marginRight: "5px" }}>??????</div>
                              <div className={styles.card_contents_text3}>?????? ????????? ??????????????????.</div>
                            </div>
                            <div className={styles.card_contents_back_sale_info}>
                              <div className={styles.card_contents_text1}>
                                {timeLeft.days}??? {timeLeft.hours}?????? {timeLeft.minutes}??? {timeLeft.seconds}???
                              </div>
                              <div className={styles.card_contents_text2}>????????? ????????? ???????????????.</div>
                              <div className={styles.card_contents_text2}>({change_date(endDate)})</div>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <div className={styles.card_contents_back_notSale}>
                          <div style={{ fontSize: "16px", marginTop: "1px", marginRight: "5px" }}>???</div>
                          <div className={styles.card_contents_text3}>?????? ???????????? ??????????????????.</div>
                        </div>
                        <div>
                          <div className={styles.card_contents_text3}>???????????? ?????? ????????? ????????? ?????????</div>
                          <div className={styles.card_contents_text3}>????????? ???????????????.</div>
                        </div>
                      </>
                    )}
                  </>
                </div>
              </div>
              <div className={styles.card_contents_back_info}>
                <div className={styles.card_contents_back_info_child}>
                  ???????????? ?????? ?????? ??????
                </div>
                <div className={styles.card_another_container}>
                  {createrNFTLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {nftCreatorList ? (
                        <>
                          <div className={styles.card_another_images}>
                            {nftCreatorList.map((v: any, i: number) => {
                              return (
                                <>
                                  {createrNFTLoading ? (
                                    <LoadingSpinner key={i} />
                                  ) : (
                                    <img
                                      className={styles.card_another_image}
                                      src={v.imageURL}
                                      alt=""
                                      key={i}
                                      onClick={() => {
                                        window.location.replace("/detail/" + v.readmeTokenId);
                                      }}
                                    />
                                  )}
                                </>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className={styles.card_another_noImages}>
                            <div>???????????? ?????? ????????? ?????????.</div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={styles.card_contents_back_info}>
                <div className={styles.card_buttons}>
                  <button className={styles.card_button} onClick={moveToBack}>
                    ??????
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
                                  ?????? ??????
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  className={styles.card_button}
                                  onClick={() => openCancelModal("refund")}
                                >
                                  ?????? ??????
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
                              ?????? ??????
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
                          ?????? ??????
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
            header="????????? ?????? ??????"
          >
            <div className={styles.modal_container}>
              <img
                className={styles.modal_img}
                src={nftDetail.imageURL}
                alt=""
              />
              <div className={styles.modal_info_container}>
                <div className={styles.modal_info}>
                  <div className={styles.modal_info_text1}>
                    <div>??????</div>
                    <div>{nftDetail.name}</div>
                  </div>
                  <div className={styles.modal_info_text1}>
                    <div>??????</div>
                    <div>{nftPrice} SSF</div>
                  </div>
                </div>
                <div className={styles.modal_info}>
                  <div className={styles.modal_info_text2}>
                    <div>?????????????????????????</div>
                  </div>
                  <div className={styles.modal_info_text2}>
                    <div>?????? ????????? ???????????? ????????? ???????????????.</div>
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
            header="????????? ?????? ?????? ??????"
          >
            <div className={styles.modal_info}>
              {loading ? (
                <LoadingPage />
              ) : (
                <>
                  <div className={styles.modal_info_text2}>
                    <div>????????? ?????????????????????????</div>
                  </div>
                  <div></div>
                  <div className={styles.modal_info_text2}>
                    <div>?????? ????????? ???????????? ?????? ????????? ???????????????.</div>
                  </div>
                </>
              )}
            </div>
          </Modal>
          <Modal
            open={completeModalOpen}
            close={() => {
              navigate("/");
              setCompleteModalOpen(false);
            }}
            fn={() => {
              navigate("/mypage");
              setCompleteModalOpen(false);
            }}
            header="????????? ?????? ??????"
            cancel="??????"
            confirm="???????????????"
          >
            <div>????????? ????????? ?????????????????????!</div>
          </Modal>
          <Modal
            open={balanceModalOpen}
            close={() => {
              setBalanceModalOpen(false);
            }}
            fn={() => setBalanceModalOpen(false)}
            header="?????? ?????? ??????"
          >
            <div>????????? ???????????????!</div>
          </Modal>
        </>
      )}
    </>
  );
};

export default NftDetailInfo;
