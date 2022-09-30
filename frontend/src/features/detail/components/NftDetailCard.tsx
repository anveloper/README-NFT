import styles from "../NftDetail.module.css";
import { truncatedAddress } from "../../../features/auth/authSlice";

/* 카드 앞면 */
const NftDetailCard = (props: any) => {
  const { tokenId, nftDetail, nftPrice, nftOwner } = props;
  return (
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
  );
};

export default NftDetailCard;
