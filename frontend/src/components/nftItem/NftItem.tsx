import React, { Suspense, useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Metadata, selectSolveList } from "../../features/nft/nftSlice";
import {
  selectUserAddress,
  truncatedAddress,
} from "../../features/auth/authSlice";

import styles from "./NftItem.module.css";
import ShareBtn from "./ShareBtn";
import LoadingSpinner from "components/loading/LoadingSpinner";

const NftItem = (props: any) => {
  const solveList = useAppSelector(selectSolveList);
  const userAddress = useAppSelector(selectUserAddress);
  const { nft, lastRef } = props;
  const [solved, setSolved] = useState(
    solveList.includes(Number(nft.readmeTokenId))
  );
  const [fileName, setFileName] = useState("");
  const [answer, setAnswer] = useState("");
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [onwer, setOwner] = useState("");
  const [description, setDescription] = useState("");
  const [imageURL, setImageURL] = useState("");
  const navigator = useNavigate();
  const [metadata, setMetadata] = useState<Metadata>({
    fileName: "",
    name: "",
    author: "",
    description: "",
    imageURL: "",
  });
  const [loading, setLoading] = useState(true);
  const getMetadata = async (metaDataURI: string) => {
    setLoading(true);
    await axios({ url: metaDataURI })
      .then((res: any) => {
        const { fileName, name, author, description, imageURL } = res.data;
        setFileName(solved || userAddress === onwer ? fileName : "???");
        setName(solved || userAddress === onwer ? name : "???");
        setAnswer(name);
        setAuthor(author);
        setDescription(description);
        setImageURL(imageURL);
        setMetadata({
          fileName,
          name,
          author,
          description,
          imageURL,
        });
        setLoading(false);
      })
      .catch((err) => {});
  };

  const moveToDetail = (tokenId: string) => {
    navigator("/detail/" + tokenId);
  };

  useEffect(() => {
    const { nft } = props;
    setOwner(nft.readmeTokenOwner);
    getMetadata(nft.metaDataURI);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, solveList]);
  const renderName = () => {
    const result = [];
    if (nft.readmeTokenId <= 50) {
      return <p>{nft.name}</p>;
    } else if (answer) {
      for (let i = 0; i < answer.length; i++) {
        result.push(
          <p key={i} className={styles.answer}>
            {solved ? answer[i] : "　"}
          </p>
        );
      }
      return result;
    } else return <p className={styles.answer}>{"　"}</p>;
  };
  return (
    <div
      ref={lastRef ?? null}
      className={styles.container}
      onClick={() => moveToDetail(nft.readmeTokenId)}
    >
      <div className={styles.card}>
        <div className={styles.front}>
          <div className={styles.sq}>
            <p className={styles.nftNumber}>{nft.readmeTokenId}</p>
            {loading ? (
              <LoadingSpinner />
            ) : (
              <img className={styles.img} src={imageURL} alt="" />
            )}
          </div>

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
          <ShareBtn tokenId={nft.readmeTokenId} metadata={metadata} />
        </div>
      </div>
    </div>
  );
};

export default NftItem;
