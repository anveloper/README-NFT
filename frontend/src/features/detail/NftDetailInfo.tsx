import styles from "./NftDetail.module.css";
import { useNavigate } from "react-router-dom";
import { MintReadmeContract, SaleReadmeContract, SSFContract, web3 } from "../../web3Config";
import { useDispatch } from "react-redux";
import { selectIsActive, setIsActive, setNftPrice } from "./NftDetailSlice";
import { Modal } from "../../components/modal/Modal";
import { useEffect, useContext, useState } from "react";
import { useAppSelector } from "app/hooks";
import { change_date, selectUserAddress } from "features/auth/authSlice";

export interface nftTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
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
  const isAvail = useAppSelector(selectIsActive);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getTimeInfo = async () => {
    const response = await SaleReadmeContract.methods.readmeTokenEndTime(tokenId).call();
    await SaleReadmeContract.methods.parseTimestamp(response).call((err: any, res: any) => {
      const nftEndTime: nftTime = {
        year: Number(res.year),
        month: Number(res.month),
        day: Number(res.day),
        hour: Number(res.hour),
        minute: Number(res.minute),
        second: Number(res.second),
      };
      setNftEndTime(nftEndTime);
      setEndDate(new Date(nftEndTime.year, nftEndTime.month - 1, nftEndTime.day, nftEndTime.hour, nftEndTime.minute, nftEndTime.second));
      setIsReady(true);
    });
  };

  const cancelSale = async () => {
    try {
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
          alert("에러남.");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const buyNftToken = async () => {
    await SSFContract.methods
      .approve(process.env.REACT_APP_SALEREADMETOKEN_CA, nftPrice)
      .send({ from: userAddress })
      .then((res: any) => {
        console.log("approve : ", res);
      })
      .catch((err: any) => {
        console.log(err);
      });
    SaleReadmeContract.methods
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
  };

  const openBuyModal = () => {
    setBuyModalOpen(true);
  };

  const closeBuyModal = () => {
    setBuyModalOpen(false);
  };

  const openCancelModal = () => {
    setCancelModalOpen(true);
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
  }, []);

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
            <div className={styles.card_contents_back_info_child}>판매 정보</div>
            <div className={styles.card_contents_back_info_child}>
              {isAvail && nftPrice !== "0" ? (
                <>
                  <div className={styles.card_contents_text1}>판매중인 리드미입니다.</div>
                  <div>
                    <div>
                      {timeLeft.days}일 {timeLeft.hours}시간 {timeLeft.minute}분 {timeLeft.seconds}초 후에 종료됩니다.
                    </div>
                    <div className={styles.card_contents_text2}>({change_date(endDate)})</div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: "18px", marginTop: "5px" }}>❌</div>
                  <div>
                    <div className={styles.card_contents_text3}>판매 상태가 아닙니다.</div>
                    <div className={styles.card_contents_text3}>소유자가 판매 등록을 완료할 때까지</div>
                    <div className={styles.card_contents_text3}>구매가 제한됩니다.</div>
                  </div>
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
                    {isAvail && nftPrice !== "0" ? (
                      <>
                        <button className={styles.card_button} onClick={openCancelModal}>
                          판매 취소
                        </button>
                      </>
                    ) : (
                      <>
                        <button className={styles.card_button} onClick={() => props.setTab("sell")}>
                          즉시 판매
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button disabled={isAvail} className={styles.card_button} onClick={openBuyModal}>
                      즉시 구매
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={buyModalOpen} close={closeBuyModal} fn={buyNftToken} header="리드미 구매 확인">
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
      <Modal open={cancelModalOpen} close={closeCancelModal} fn={cancelSale} header="리드미 판매 취소 확인">
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
