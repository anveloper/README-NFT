import React, { Suspense, useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { selectSolveList } from "../../features/nft/nftSlice";
import { truncatedAddress } from "../../features/auth/authSlice";

import blank from "../../assets/template/template_word.svg";

import styles from "./NftItem.module.css";

const NftItem = (props: any) => {
  const solveList = useAppSelector(selectSolveList);
  const { nft, lastRef } = props;
  const [solved, setSolved] = useState(
    solveList.includes(Number(nft.readmeTokenId))
  );
  const [fileName, setFileName] = useState("");
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const navigator = useNavigate();

  const getMetadata = async (metaDataURI: string) => {
    await axios({ url: metaDataURI })
      .then((res: any) => {
        const { fileName, name, author, description, imageURL } = res.data;
        setFileName(solved ? fileName : "???");
        setName(solved ? name : "???");
        setAnswer(name);
        setAuthor(author);
        setDescription(description);
        setImageURL(imageURL);
      })
      .catch((err) => {});
  };

  const moveToDetail = (tokenId: string) => {
    navigator("/detail/" + tokenId);
  };

  useEffect(() => {
    const { metaDataURI } = props;
    getMetadata(metaDataURI);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);
  const renderName = () => {
    const result = [];
    for (let i = 0; i < answer.length; i++) {
      result.push(
        <p key={i} className={styles.answer}>
          {solved ? answer[i] : "　"}
        </p>
      );
    }
    return result;
  };
  return (
    <button
      ref={lastRef ?? null}
      className={styles.container}
      onClick={() => moveToDetail(nft.readmeTokenId)}
    >
      <div className={styles.card}>
        <div className={styles.front}>
          <Suspense fallback={<p>이미지 로딩중</p>}>
            <div className={styles.sq}>
              <p className={styles.nftNumber}>{nft.readmeTokenId}</p>
              <img className={styles.img} src={imageURL} alt="" />
            </div>
          </Suspense>
          <div className={styles.nftInfo}>{renderName()}</div>
        </div>
        <div className={styles.back}>
          <div>
            <p>README</p>
            <p>{name}</p>
          </div>
          <div>
            <p>CREATOR</p>
            <p>{truncatedAddress(author)}</p>
          </div>
          <div>
            <p>SOLVER</p>
            <p>{truncatedAddress(description)}</p>
          </div>
          <hr className={styles.nftLine} />
          <div>
            <p>PRICE</p>
            <p>{nft.readmeTokenPrice}</p>
          </div>
        </div>
      </div>
    </button>
  );
};

export default NftItem;
