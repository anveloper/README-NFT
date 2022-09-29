import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";

import ModalPortal from "../modal/ModalPortal";
import NftDetailModal from "../../features/detail/NftDetailModal";
import blank from "../../assets/template/template_word.svg";

import styles from "./NftItem.module.css";
const CarouselItem = (props: any) => {
  const { nft } = props;
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const getMetadata = async (metaDataURI: string) => {
    await axios({ url: metaDataURI })
      .then((res: any) => {
        const { name, imageURL } = res.data;
        setName(name);
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
  const answerWord = () => {
    const result = [];
    for (let i = 0; i < name.length; i++) {
      result.push(<img key={i} className={styles.blank} src={blank} alt="" />);
    }
    return result;
  };
  return (
    <>
      <button className={styles.carouselContainer} onClick={openModal}>
        <Suspense fallback={<p>이미지 로딩중</p>}>
          <div className={styles.sq}>
            <img className={styles.img} src={imageURL} alt="" />
          </div>
        </Suspense>
        <div className={styles.carouselInfo}>{answerWord()}</div>
      </button>
      <div>
        {modalOpen && (
          <ModalPortal>
            <NftDetailModal
              open={modalOpen}
              close={closeModal}
              image={imageURL}
              answer={name}
              tokenId={nft.readmeTokenId}
            />
          </ModalPortal>
        )}
      </div>
    </>
  );
};

export default CarouselItem;
