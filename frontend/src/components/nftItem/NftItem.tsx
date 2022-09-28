import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";

import styles from "./NftItem.module.css";
import { truncatedAddress } from "../../features/auth/authSlice";
import ModalPortal from "../modal/ModalPortal";
import NftDetailModal from "../../features/detail/NftDetailModal";

const NftItem = (props: any) => {
  const { nft, lastRef } = props;
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const getMetadata = async (metaDataURI: string) => {
    await axios({ url: metaDataURI })
      .then((res: any) => {
        const { fileName, name, author, description, imageURL } = res.data;
        setFileName(fileName);
        setName(name);
        setAuthor(author);
        setDescription(description);
        setImageURL(imageURL);
      })
      .catch((err) => {});
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const { metaDataURI } = props;
    getMetadata(metaDataURI);
  }, [props]);

  return (
    // {/* <button className={styles.container} onClick={() => moveToDetail(nft.readmeTokenId)}> */}
    <div className={styles.container}>
      <div onClick={openModal}>
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
      </div>
      {modalOpen && (
        <ModalPortal>
          <NftDetailModal open={modalOpen} close={closeModal} image={imageURL} answer={name} tokenId={nft.readmeTokenId} />
        </ModalPortal>
      )}
    </div>
  );
};

export default NftItem;
