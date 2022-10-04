import styles from "./NftDetail.module.css";
import { useNavigate } from "react-router-dom";
import { SaleReadmeContract, SSFContract } from "../../web3Config";
import { useDispatch } from "react-redux";
import { setIsActive } from "./NftDetailSlice";
import { Modal } from "../../components/modal/Modal";
import { useEffect, useState } from "react";

const NftDetailInfo = (props: any) => {
  const { isActive, nftOwner, userAddress, tokenId, nftDetail, nftPrice } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const [nftYear, setNftYear] = useState("");
  const [nftMonth, setNftMonth] = useState("");
  const [nftDay, setNftDay] = useState("");
  const [nftMinute, setNftMinute] = useState("");
  const [nftSecond, setNftSecond] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getTimeInfo = async () => {
    await SaleReadmeContract.methods.parseTimestamp(3600).call((res: any) => {
      console.log(res);
    });
    await SaleReadmeContract.methods.getYear(tokenId).call((res: any) => {
      console.log(res);
      setNftYear(res);
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
        console.log(res);
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
        window.location.replace("/detail/" + tokenId);
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
                  <div>종료일: {nftYear}</div>
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
        <img src={nftDetail.imageURL} alt="" />
        <div>이거 진짜 살거?</div>
        <div>{nftPrice} SSF : 이 가격에 ?</div>
      </Modal>
    </>
  );
};

export default NftDetailInfo;
