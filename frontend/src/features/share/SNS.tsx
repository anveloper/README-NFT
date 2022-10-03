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
          console.log(err);
          console.log(res);
          if (metadataURI) getMetadata(metadataURI);
        });
    console.log("readme", pathname, tokenId);
    console.log(MintReadmeContract.methods);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tokenId]);

  const moveLive = () => {
    navigate("/live");
  };
  const moveMarket = () => {
    navigate("/sale");
  };
  return (
    <div className={styles.container}>
      <div className={styles.btnGroup}>
        <button className={`${styles.btn} ${styles.lg}`} onClick={moveLive}>
          리드미
          <br />
          게임하러
          <br />
          가기
        </button>
      </div>
      <div className={styles.card}>
        <img
          className={styles.img}
          src={rtk.imageURL}
          alt={`README ${tokenId}번째 토큰 이미지 `}
        />
        <div>
          <div>리드미 : {rtk.name}</div>
          <div>
            <p>그린 사람</p>
            <p className={styles.address}>{rtk.author}</p>
          </div>
          <div>
            <p>맞춘 사람</p>
            <p className={styles.address}>{rtk.description}</p>
          </div>
        </div>
      </div>
      <div className={styles.btnGroup}>
        <button className={`${styles.btn} ${styles.sm}`} onClick={moveLive}>
          리드미
          <br />
          게임하러
          <br />
          가기
        </button>
        <button className={styles.btn} onClick={moveMarket}>
          NFT
          <br />
          구경하러
          <br />
          가기
        </button>
      </div>
      <p className={styles.fileName}>{rtk.fileName}</p>
    </div>
  );
};

export default SNS;
