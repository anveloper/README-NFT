// image
import axios from "axios";
import { FC, useEffect, useState } from "react";
import lion from "../../../assets/characters/lion.svg";
// css
import styles from "../MyPage.module.css";

export interface IMyNFTCard {
  tokenId: string;
  price: string;
  owner: string;
  metadataURI: string;
}

const MyNFTCard: FC<IMyNFTCard> = ({ tokenId, price, owner, metadataURI }) => {
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  const getNFTDetail = async (metadataURI: string) => {
    try {
      await axios({ url: metadataURI }).then((response) => {
        const { fileName, name, author, description, imageURL } = response.data;
        setFileName(fileName);
        setName(name);
        setAuthor(author);
        setDescription(description);
        setImageURL(imageURL);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getNFTDetail(metadataURI);
  }, [metadataURI]);

  return (
    <div className={styles.MyNFTCard}>
      <img className={styles.MyNFTCardImg} src={lion} alt="" />

      <div>
        <div className={styles.MyNFTCardTextBox}>
          <h4 className={styles.MyNFTCardLeftText}>{name}</h4>
          <p className={styles.MyNFTCardRightText}>{author}</p>
        </div>

        <div className={styles.MyNFTCardTextBox}>
          <h5 className={styles.MyNFTCardLeftText}>{price} SSF</h5>
          <p className={styles.MyNFTCardRightText}>First Solver</p>
        </div>
      </div>
    </div>
  );
};

export default MyNFTCard;
