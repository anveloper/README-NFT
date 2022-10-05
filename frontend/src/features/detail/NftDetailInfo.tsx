import styles from "./NftDetail.module.css";
import { useNavigate } from "react-router-dom";
import { SaleReadmeContract, SSFContract, web3 } from "../../web3Config";
import { useDispatch } from "react-redux";
import { setIsActive } from "./NftDetailSlice";
import { Modal } from "../../components/modal/Modal";
import { useEffect, useContext, useState } from "react";
import { SocketContext } from "socketConfig";

interface nftTime {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const NftDetailInfo = (props: any) => {
  const { isActive, nftOwner, userAddress, tokenId, nftDetail, nftPrice } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [nftEndTime, setNftEndTime] = useState<nftTime>({
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);

  const getTimeInfo = async () => {
    const response = await SaleReadmeContract.methods.readmeTokenEndTime(tokenId).call();
    // console.log("결과", response);
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
    });
  };

  const cancelSale = async () => {
    if (window.confirm("정말 판매 등록 취소?")) {
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
        socket.emit("sendNotification", {
          receiverWallet: nftOwner,
          nftName: nftDetail.name,
        });
        // 새로고침.
        window.location.replace("/detail/" + tokenId);
        console.log("purchase : ", res);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const moveToBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    getTimeInfo();
  }, []);

  return (
    <>
      <div className={styles.cards}>
        <div className={styles.card_contents_back}>
          <div className={styles.card_contents_back_info}>
            <div className={styles.card_contents_back_info_child}>
              {isActive ? (
                <>
                  <div>판매 중입니다.</div>
                  <div>즉시 구매하시거나, 경매에 참여할 수 있습니다.</div>
                  <div>
                    종료일: {nftEndTime.year}년 {nftEndTime.month}월 {nftEndTime.day}일 {nftEndTime.hour}시 {nftEndTime.minute}분 {nftEndTime.second}초{" "}
                  </div>
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
                        <button className={styles.card_button} onClick={() => props.setTab("sell")}>
                          즉시 판매
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button disabled={!isActive} className={styles.card_button} onClick={openModal}>
                      즉시 구매
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={modalOpen} close={closeModal} fn={buyNftToken} header="리드미 구매 확인">
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
    </>
  );
};

export default NftDetailInfo;
