import styles from "./NftDetail.module.css";
import BackgroundFlower from "../../components/BackgroundFlower";
import { useState } from "react";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { useAppSelector } from "../../app/hooks";
import { selectUserAddress } from "../auth/authSlice";
import { selectNftDetail } from "./NftDetailSlice";
import { useParams } from "react-router-dom";

const NftSell = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const nftDetail = useAppSelector(selectNftDetail);
  const { tokenId } = useParams();
  const [inputPrice, setInputPrice] = useState(0);
  const [inputPeriod, setInputPeriod] = useState("");

  const handleChangePrice = (e: any) => {
    setInputPrice(e.target.value);
  };

  const handleChangePeriod = (e: any) => {
    setInputPeriod(e.target.value); // 기간 단위가 어떻게 되는지?
  };

  const sellReadmeTokens = () => {
    try {
      const response = SaleReadmeContract.methods.setForSaleReadmeToken(tokenId, inputPrice, inputPeriod).send({ from: userAddress });
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.sell_background}>
      <BackgroundFlower />
      <div className={styles.detail}>
        <div className={styles.detail_container}>
          <div className={styles.cards}>
            <div className={styles.card_contents_front}>
              <img className={styles.card_img} src={nftDetail.imageURL} alt="dog" />
              <div className={styles.card_img_info}>
                <p>NFT Name: {nftDetail.fileName}</p>
                <p>Price:</p>
                <p>Creator: {nftDetail.author}</p>
                <p>Seller: </p>
              </div>
            </div>
          </div>
          <div className={styles.cards}>
            <div className={styles.card_contents_back}>
              <div className={styles.card_contents_back_price}>
                <div>
                  <button
                    onClick={() => {
                      MintReadmeContract.methods.setApprovalForAll(process.env.REACT_APP_SALEREADMETOKEN_CA, true).send({ from: userAddress });
                    }}
                  >
                    판매 권한 주기
                  </button>
                </div>
              </div>
              <div className={styles.card_contents_back_history}>
                <p>가격 입력</p>
                <input type="number" name="inputPrice" onChange={handleChangePrice} value={inputPrice} />
                <p>기간 설정</p>
                <select onChange={handleChangePeriod}>
                  <option selected>기간 선택하기</option>
                  <option>1시간</option>
                  <option>12시간</option>
                  <option>1일</option>
                  <option>1주일</option>
                </select>
                <p>{inputPeriod}</p>
              </div>
              <div className={styles.card_buttons}>
                <button className={styles.card_button}>이전</button>
                <button className={styles.card_button} onClick={sellReadmeTokens}>
                  판매하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftSell;
