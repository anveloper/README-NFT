import React, { useContext, useEffect, useState } from "react";
import Web3 from "web3";

import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { MintReadmeToken } from "abi/MintReadmeTokenABI";
import axios from "axios";
import { Metadata } from "features/nft/nftSlice";

import styles from "./SNS.module.css";
import MoveSale from "./components/MoveSale";
import MoveGame from "./components/MoveGame";
import { SocketContext } from "socketConfig";

const web3 = new Web3(process.env.REACT_APP_ETHEREUM_RPC_URL);
const MintReadmeContract = new web3.eth.Contract(
  MintReadmeToken,
  process.env.REACT_APP_MINTREADMETOKEN_CA
);

const SNS = () => {
  const socket = useContext(SocketContext);
  const { pathname } = useLocation();
  let { tokenId } = useParams();
  const id = Number(tokenId);
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
      setRtk(response.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (socket) socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    console.log(id);
    if (!isNaN(id))
      MintReadmeContract.methods.tokenURI(id).call((err: any, res: any) => {
        const metadataURI = res;
        if (metadataURI) getMetadata(metadataURI);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, id]);

  return (
    <div className={styles.container}>
      <div className={styles.btnGroup}>
        <MoveGame className={`${styles.btn} ${styles.lg}`} />
      </div>
      <div className={styles.content}>
        <div className={styles.title}>README 🎨 내 마음을 읽어줘</div>
        <div className={styles.card}>
          <img
            className={styles.img}
            src={rtk.imageURL}
            alt={`README ${id}번째 토큰 이미지 `}
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
      </div>
      <div className={styles.btnGroup}>
        <MoveGame className={`${styles.btn} ${styles.sm}`} />
        <MoveSale />
      </div>
      <p className={styles.fileName}>{rtk.fileName}</p>
    </div>
  );
};

export default SNS;

export const SNSRoutes = () => {
  return (
    <Routes>
      <Route path="/readme/:tokenId" element={<SNS />} />;
    </Routes>
  );
};
