import styles from "./NftDetail.module.css";
import BackgroundFlower from "../../components/BackgroundFlower";
import { useEffect, useState } from "react";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { change_date, selectUserAddress } from "../auth/authSlice";
import { selectNftDetail, selectNftPrice, selectNftOwner, selectSaleDate, setSaleDate } from "./NftDetailSlice";
import { useNavigate, useParams } from "react-router-dom";
import { truncatedAddress } from "../../features/auth/authSlice";
import { Modal } from "../../components/modal/Modal";
import { SaleReadmeToken } from "../../abi/SaleReadmeTokenABI";

const NftSell = () => {
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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChangePrice = (e: any) => {
    if (e.target.value < 1) {
      alert("0보다 큰 값");
      return;
    }
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
    try {
      SaleReadmeContract.methods
        .setForSaleReadmeToken(tokenId, inputPrice, inputPeriod)
        .send({ from: userAddress })
        .then((res: any) => {
          console.log("이게 res다. ", res);
          let saleDate = {
            saleStartDay: startDay,
            saleEndDay: endDay,
          };
          dispatch(setSaleDate(saleDate));
          navigate("/detail/" + tokenId);
        });
    } catch (error) {
      console.log(error);
    }
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

  return (
    <div className={styles.sell_background}>
      <BackgroundFlower />
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
                {nftPrice === 0 ? <div>미판매</div> : <div>{nftPrice} SSF</div>}
              </div>
            </div>
          </div>

          {/* 카드 뒷장 */}
          <div className={styles.cards}>
            <div className={styles.card_contents_back}>
              <div className={styles.card_contents_back_info}>
                <div className={styles.card_contents_back_info_child}>
                  <button
                    className={styles.card_button}
                    onClick={() => {
                      MintReadmeContract.methods.setApprovalForAll(process.env.REACT_APP_SALEREADMETOKEN_CA, true).send({ from: userAddress });
                    }}
                  >
                    판매 권한 주기
                  </button>
                </div>
              </div>
              <div className={styles.card_contents_back_info}>
                <p>가격 입력</p>
                <input type="number" name="inputPrice" onChange={handleChangePrice} value={inputPrice} />
                <p>기간 설정</p>
                <select onChange={handleChangePeriod}>
                  <option value="1">1시간</option>
                  <option value="12">12시간</option>
                  <option value="24">1일</option>
                  <option value="168">1주일</option>
                </select>
                <div>
                  시작일: {startDay.getFullYear()}년 {startDay.getMonth() + 1}월 {startDay.getDate()}일 {startDay.getHours()}시 {startDay.getMinutes()}분
                </div>
                <p>
                  종료일: {endDay.getFullYear()}년 {endDay.getMonth() + 1}월 {endDay.getDate()}일 {endDay.getHours()}시 {endDay.getMinutes()}분
                </p>
              </div>
              <div className={styles.card_contents_back_info}>
                <div className={styles.card_buttons}>
                  <button className={styles.card_button} onClick={moveToBack}>
                    이전
                  </button>
                  <button className={styles.card_button} onClick={openModal}>
                    판매 등록
                  </button>
                  <Modal open={modalOpen} close={closeModal} fn={sellReadmeTokens} header="리드미 판매 확인">
                    <img src={nftDetail.imageURL} alt="dog" width={300} />
                    <div>이거 진짜</div>
                    <div>{inputPrice} : 이 가격에</div>
                    <div>{change_date(startDay)} : 이 때부터</div>
                    <div>{change_date(endDay)} : 이 때까지</div>
                    <div>판매할 것?</div>
                    <div>확인하면 진짜 등록됨.</div>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className={styles.sell_background}>
  //     <BackgroundFlower />
  //     <div className={styles.detail}>
  //       <div className={styles.detail_container}>
  //         <div className={styles.cards}>
  //           <div className={styles.card_contents_front}>
  //             <img className={styles.card_img} src={nftDetail.imageURL} alt="dog" />
  //             <div className={styles.card_img_info}>
  //               <p>NFT Name: {nftDetail.fileName}</p>
  //               <p>Price: {nftPrice} </p>
  //               <p>Creator: {nftDetail.author}</p>
  //               <p>Seller: {truncatedAddress(nftOwner)}</p>
  //             </div>
  //           </div>
  //         </div>
  //         <div className={styles.cards}>
  //           <div className={styles.card_contents_back}>
  //             <div className={styles.card_contents_back_price}>
  //               <div>
  //                 <button
  //                   onClick={() => {
  //                     MintReadmeContract.methods.setApprovalForAll(process.env.REACT_APP_SALEREADMETOKEN_CA, true).send({ from: userAddress });
  //                   }}
  //                 >
  //                   판매 권한 주기
  //                 </button>
  //               </div>
  //             </div>
  //             <div className={styles.card_contents_back_history}>
  //               <p>가격 입력</p>
  //               <input type="number" name="inputPrice" onChange={handleChangePrice} value={inputPrice} />
  //               <p>기간 설정</p>
  //               <select onChange={handleChangePeriod}>
  //                 <option selected>기간 선택하기</option>
  //                 <option>1시간</option>
  //                 <option>12시간</option>
  //                 <option>1일</option>
  //                 <option>1주일</option>
  //               </select>
  //               <p>{inputPeriod}</p>
  //             </div>
  //             <div className={styles.card_buttons}>
  //               <button className={styles.card_button} onClick={moveToBack}>
  //                 이전
  //               </button>
  //               <button className={styles.card_button} onClick={sellReadmeTokens}>
  //                 판매하기
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default NftSell;
