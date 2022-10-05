// image
import axios from "axios";
import LoadingSpinner from "components/loading/LoadingSpinner";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lion from "../../../assets/characters/lion.svg";
// css
import styles from "../MyPage.module.css";

export interface IMyNFTCard {
  readmeTokenId: string;
  readmeTokenPrice: string;
  readmeTokenOwner: string;
  metaDataURI: string;
}

const MyNFTCard: FC<IMyNFTCard> = ({
  readmeTokenId,
  readmeTokenPrice,
  readmeTokenOwner,
  metaDataURI,
}) => {
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  console.log(readmeTokenId);
  const getNFTDetail = async (metadataURI: string) => {
    setLoading(true);
    try {
      console.log(metaDataURI);
      await axios({ url: metadataURI }).then((response) => {
        const { fileName, name, author, description, imageURL } = response.data;
        setFileName(fileName);
        console.log(response.data);
        setName(name);
        setAuthor(author);
        setDescription(description);
        setImageURL(imageURL);
        setLoading(false);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNFTDetail(metaDataURI);
  }, [metaDataURI]);

  const moveNFTCardDetail = (tokenId: string) => {
    navigate("/detail/" + tokenId);
  };

  return (
    <div
      className={styles.MyNFTCard}
      onClick={() => moveNFTCardDetail(readmeTokenId)}
    >
      <div className={styles.MyNFTCardImgBox}>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <img className={styles.MyNFTCardImg} src={imageURL} alt="" />
        )}
      </div>

      <div>
        <div className={styles.MyNFTCardTextBox}>
          <h4 className={styles.MyNFTCardLeftText}>{name}</h4>
          <p className={styles.MyNFTCardRightText}>{author}</p>
        </div>

        <div className={styles.MyNFTCardTextBox}>
          {!readmeTokenPrice ? (
            <button>판매</button>
          ) : (
            <h5 className={styles.MyNFTCardLeftText}>{readmeTokenPrice} SSF</h5>
          )}
          {/* <h5 className={styles.MyNFTCardLeftText}>{readmeTokenPrice} SSF</h5> */}
          <p className={styles.MyNFTCardRightText}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default MyNFTCard;
