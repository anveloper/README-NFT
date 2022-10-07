import { useNavigate } from "react-router-dom";
import styles from "./NftSaleList.module.css";

const NftSaleListItem = (props: any) => {
  const { nft } = props;
  const navigator = useNavigate();

  return (
    <div className={styles.card_container} key={nft.tokenId} onClick={() => navigator("/detail/" + nft.tokenId)}>
      <div className={styles.card}>
        <div className={styles.img_sq}>
          <p className={styles.nftNumber}>{nft.tokenId}</p>
          <img className={styles.img} src={nft.imageURL} alt="NFT이미지" width={300} />
        </div>
        <div className={styles.price_info}>
          {nft.price === "0" ? (
            <>
              <div>PRICE</div>
              <div>미판매</div>
            </>
          ) : (
            <>
              <div>PRICE</div>
              <div>{nft.price}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftSaleListItem;
