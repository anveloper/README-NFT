import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";

import styles from "./NftItem.module.css";
import { truncatedAddress } from "../../features/auth/authSlice";

const NftItem = (props: any) => {
  const { nft } = props;
  const [flip, setFlip] = useState(false);
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  const getMetadata = async (metaDataURI: string) => {
    try {
      await axios({ url: metaDataURI }).then((res: any) => {
        const { fileName, name, author, description, imageURL } = res.data;
        setFileName(fileName);
        setName(name);
        setAuthor(author);
        setDescription(description);
        setImageURL(imageURL);
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const { metaDataURI } = props;
    getMetadata(metaDataURI);
  }, [props]);

  return (
    <button className={styles.container} onClick={() => setFlip(!flip)}>
      <div className={styles.card}>
        <div className={styles.front}>
          <Suspense fallback={<p>이미지 로딩중</p>}>
            <img className={styles.img} src={imageURL} alt="" />
          </Suspense>
        </div>
        <div className={styles.back}>
          <p>리드미: {name}</p>
          <p>작성자: {truncatedAddress(author)}</p>
          <p>맞춘이: {truncatedAddress(description)}</p>
          <small>파일이름: {fileName}</small>
        </div>
      </div>
      <div className={styles.nftInfo}>
        <p>리드미ID: {nft.readmeTokenId}번째</p>
        <p>PRICE: {nft.readmeTokenPrice}</p>
      </div>
    </button>
  );
};

export default NftItem;

/* {nft && (
  <div>
    
    
    <div>OWNER: {nft.readmeTokenOwner}</div>
    <div>URI: {nft.metaDataURI}</div>
  </div>
)} */
