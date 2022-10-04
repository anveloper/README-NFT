import { useNavigate } from "react-router-dom";
import styles from "./NftSaleList.module.css";

const NftSaleListItem = (props: any) => {
  const { nft } = props;
  const navigator = useNavigate();

  return (
    <div className={styles.card_container} key={nft.tokenId} onClick={() => navigator("/detail/" + nft.tokenId)}>
      <div className={styles.card}>
        <div className={styles.img_sq}>
          <img className={styles.img} src={nft.imageURL} alt="NFT이미지" width={300} />
        </div>
        <div>가격: {nft.price}</div>
      </div>
    </div>
  );
};

export default NftSaleListItem;
