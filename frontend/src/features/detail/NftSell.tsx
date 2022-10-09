import styles from "./NftDetail.module.css";
import { useEffect, useState } from "react";
import {
  MintReadmeContract,
  MintReadMeContractGO,
  SaleReadmeContract,
  SaleReadmeContractGO,
} from "../../web3Config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  change_date,
  selectIsSSAFY,
  selectUserAddress,
} from "../auth/authSlice";
import {
  selectNftDetail,
  selectNftPrice,
  selectNftOwner,
} from "./NftDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import { truncatedAddress } from "../../features/auth/authSlice";
import { Modal } from "../../components/modal/Modal";
import LoadingPage from "components/loading/LoadingPage";

const NftSell = (props: any) => {
  const userAddress = useAppSelector(selectUserAddress);
  const nftDetail = useAppSelector(selectNftDetail);
  const nftPrice = useAppSelector(selectNftPrice);
  const nftOwner = useAppSelector(selectNftOwner);
  const { tokenId } = useParams();
  const [inputPrice, setInputPrice] = useState(0);
  const [inputPeriod, setInputPeriod] = useState(0);
  const [startDay, setStartDay] = useState(new Date());
  const [endDay, setEndDay] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAlertOpen, setModalAlertOpen] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isSSAFY = useAppSelector(selectIsSSAFY);
  const handleChangePrice = (e: any) => {
    setInputPrice(e.target.value);
  };

  const handleChangePeriod = (e: any) => {
    // 종료 시간 계산
    const endDay = new Date(startDay);
    endDay.setSeconds(startDay.getSeconds() + parseInt(e.target.value) * 3600);
    setEndDay(endDay);

    // value를 1시간 단위로 받아와서 바로 초단위로 변환.
    setInputPeriod(parseInt(e.target.value) * 3600);
  };

  const sellReadmeTokens = () => {
    setSellLoading(true);
    try {
      isSSAFY
        ? SaleReadmeContract.methods
            .setForSaleReadmeToken(tokenId, inputPrice, inputPeriod)
            .send({ from: userAddress })
            .then((res: any) => {
              // 새로고침.
              window.location.replace("/detail/" + tokenId);
              setSellLoading(false);
            })
        : SaleReadmeContractGO.methods
            .setForSaleReadmeToken(tokenId, inputPrice, inputPeriod)
            .send({ from: userAddress })
            .then((res: any) => {
              // 새로고침.
              window.location.replace("/detail/" + tokenId);
              setSellLoading(false);
            });
    } catch (error) {
      console.log(error);
      setSellLoading(false);
    }
  };

  const openModal = () => {
    if (inputPrice < 1) {
      setModalAlertOpen(true);
      return;
    }
    setModalOpen(true);
  };

  const closeAlertModal = () => {
    setModalAlertOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const moveToBack = () => {
    navigate(-1);
  };

  return (
    <>
      {sellLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div className={styles.cards}>
            {approveLoading ? (
              <LoadingPage msg="메타마스크 팝업창의 판매 권한 승인 뒤 판매 정보 입력이 가능합니다." />
            ) : (
              <div className={styles.card_contents_back}>
                <div className={styles.card_contents_back_info}>
                  <div className={styles.card_contents_back_info_child}>
                    판매 권한 설정
                  </div>
                  <div>토큰 거래를 위해 판매 권한을 요청해주세요.</div>
                  <div>
                    <button
                      className={styles.card_button}
                      onClick={async () => {
                        setApproveLoading(true);
                        isSSAFY
                          ? await MintReadmeContract.methods
                              .setApprovalForAll(
                                process.env.REACT_APP_SALEREADMETOKEN_CA,
                                true
                              )
                              .send({ from: userAddress })
                          : await MintReadMeContractGO.methods
                              .setApprovalForAll(
                                process.env.REACT_APP_SALEREADMETOKEN_CA,
                                true
                              )
                              .send({ from: userAddress });
                        setApproveLoading(false);
                      }}
                    >
                      판매 권한 요청
                    </button>
                  </div>
                </div>
                <div className={styles.card_contents_back_info2}>
                  <div className={styles.contents_center}>
                    <div className={styles.input_place_title}>
                      판매 정보 입력
                    </div>
                  </div>
                  <div className={styles.input_place}>
                    <p>가격</p>
                    <div className={styles.input_price}>
                      <input
                        className={styles.input_text}
                        type="number"
                        name="inputPrice"
                        onChange={handleChangePrice}
                        value={inputPrice}
                      />
                      <div>SSF</div>
                    </div>
                  </div>
                  <div className={styles.input_place}>
                    <p>판매 기간</p>
                    <div className={styles.input_price}>
                      <select
                        className={styles.selectBox}
                        onChange={handleChangePeriod}
                      >
                        <option>기간 선택</option>
                        <option value="1">1시간</option>
                        <option value="12">12시간</option>
                        <option value="24">1일</option>
                        <option value="168">1주일</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={styles.card_contents_back_info}>
                  <div className={styles.card_buttons}>
                    <button className={styles.card_button} onClick={moveToBack}>
                      이전
                    </button>
                    <button className={styles.card_button} onClick={openModal}>
                      판매 등록
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Modal
            open={modalOpen}
            close={closeModal}
            fn={sellReadmeTokens}
            header="리드미 판매 확인"
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
                    <div>판매 가격</div>
                    <div>{inputPrice} SSF</div>
                  </div>
                  <div className={styles.modal_info_text1}>
                    <div>판매 종료일</div>
                    <div>{change_date(endDay)}</div>
                  </div>
                </div>
                <div className={styles.modal_info}>
                  <div className={styles.modal_info_text2}>
                    <div>해당 리드미를 판매하시겠습니까?</div>
                  </div>
                  <div className={styles.modal_info_text2}>
                    <div>확인 버튼을 누르면 등록이 완료됩니다.</div>
                  </div>
                </div>
              </div>
            </div>
          </Modal>

          <Modal
            open={modalAlertOpen}
            close={closeAlertModal}
            fn={closeAlertModal}
            header="리드미 판매 등록 오류"
          >
            <div className={styles.modal_info}>
              <div className={styles.modal_info_text2}>
                <div>0보다 큰 값을 입력해주세요.</div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default NftSell;
