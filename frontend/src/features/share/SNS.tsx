import React, { useEffect, useState } from "react";
import Web3 from "web3";

import { useLocation, useNavigate } from "react-router-dom";
import { MintReadmeToken } from "abi/MintReadmeTokenABI";
import axios from "axios";
import { Metadata } from "features/nft/nftSlice";

import styles from "./SNS.module.css";

const web3 = new Web3(process.env.REACT_APP_ETHEREUM_RPC_URL);
const MintReadmeContract = new web3.eth.Contract(
  MintReadmeToken,
  process.env.REACT_APP_MINTREADMETOKEN_CA
);
const SNS = () => {
  const { pathname } = useLocation();
  const tokenId = Number(pathname.split("/")[2]);
  const navigate = useNavigate();

  const [rtk, setRtk] = useState<Metadata>({
    fileName: "",
    name: "",
    author: "",
    description: "",
    imageURL: "",
  });

  const getMetadata = async (metadataURI: string) => {
    try {
      const response = await axios({ url: metadataURI });
      console.log(response.data);
      setRtk(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!isNaN(tokenId))
      MintReadmeContract.methods
        .tokenURI(tokenId)
        .call((err: any, res: any) => {
          const metadataURI = res;
          if (metadataURI) getMetadata(metadataURI);
          console.log(metadataURI);
        });
    console.log("readme", pathname, tokenId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tokenId]);
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          className={styles.img}
          src={rtk.imageURL}
          alt={`README ${tokenId.toString}번째 토큰 이미지 `}
        />
        <div>
          <div>리드미 : {rtk.name}</div>
          <div>그린 사람 : {rtk.author}</div>
          <div>맞춘 사람 : {rtk.description}</div>
        </div>
      </div>
      <p className={styles.fileName}>{rtk.fileName}</p>
    </div>
  );
};

export default SNS;
