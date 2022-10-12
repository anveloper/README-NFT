import React, { Suspense, useEffect, useState } from "react";
import axios from "axios";

import ModalPortal from "../modal/ModalPortal";
import NftDetailModal from "../../features/detail/NftDetailModal";
import blank from "../../assets/template/template_word.svg";

import styles from "./NftItem.module.css";
import LoadingSpinner from "components/loading/LoadingSpinner";
import { Modal } from "components/modal/Modal";
const CarouselItem = (props: any) => {
  const { nft } = props;
  const [name, setName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [answerModalOpen, setAnswerModalOpen] = useState(false);

  const getMetadata = async (metaDataURI: string) => {
    setLoading(true);
    await axios({ url: metaDataURI })
      .then((res: any) => {
        const { name, imageURL } = res.data;
        setName(name);
        setImageURL(imageURL);
        setLoading(false);
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

  useEffect(() => {
    if (correctAnswer) {
      console.log("정답 모달 열기");
      setAnswerModalOpen(true);
      console.log("answermodalopen : ", answerModalOpen);
      setCorrectAnswer(false);
    }
  }, [correctAnswer]);

  return (
    <>
      <button className={styles.carouselContainer} onClick={openModal}>
        <div className={styles.sq}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <img className={styles.img} src={imageURL} alt="" />
          )}
        </div>
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
              setCorrectAnswer={setCorrectAnswer}
            />
          </ModalPortal>
        )}
      </div>

      <div>
        <ModalPortal>
          <Modal
            open={answerModalOpen}
            close={() => setAnswerModalOpen(false)}
            header="리드미 정답 맞추기"
            fn={() => setAnswerModalOpen(false)}
          >
            <div>정답입니다!</div>
          </Modal>
        </ModalPortal>
      </div>
    </>
  );
};

export default CarouselItem;
