import React, { useEffect, FC, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
// state
import {
  MintReadmeContract,
  mintReadmeToken,
  mintReadmeTokenGo,
} from "../../web3Config";
import { selectImgBlob, selectStatus, selectTmpInfo } from "./mintSlice";
// components
import NewHelmet from "../../components/NewHelmet";
import { create } from "ipfs-http-client";

// css
import styles from "./Mint.module.css";
import Loading from "../../components/loading/Loading";
import { postProblem } from "features/nft/nftSlice";
import { selectIsSSAFY, selectUserAddress } from "features/auth/authSlice";
import LoadingPage from "components/loading/LoadingPage";

const ipfsUrl =
  process.env.NODE_ENV !== "production"
    ? "http://[도메인]:5001"
    : "https://[도메인]";

const Mint: FC = () => {
  const account = useAppSelector(selectUserAddress);
  const { answer, creator, solver, tmpUrl } = useAppSelector(selectTmpInfo);
  const imgBlob: Blob = useAppSelector(selectImgBlob);
  const status = useAppSelector(selectStatus);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const isSSAFY = useAppSelector(selectIsSSAFY);
  const handleAddItem = async () => {
    const fr = new FileReader();
    const client = create({ url: ipfsUrl });
    fr.readAsArrayBuffer(imgBlob);
    fr.onload = async () => {
      if (typeof fr.result !== "string") {
        const sol = solver.length !== 0 ? solver : creator;
        const cid = await client.add(Buffer.from(fr.result));
        const imageURL = "https://ipfs.io/ipfs/" + cid.path;
        let metadata = {
          fileName: answer,
          name: answer,
          author: creator,
          description: sol,
          imageURL: imageURL,
          image: imageURL,
        };
        const result = await client.add(JSON.stringify(metadata));
        const tokenURI = "https://ipfs.io/ipfs/" + result.path;

        setLoading(true);
        if (isSSAFY) {
          mintReadmeToken(tokenURI, account, answer, sol)
            .then((receipt: any) => {
              console.log(receipt?.events.returnValues);
              if (receipt.events?.returnValues) {
                const tokenId = receipt?.events.returnValues.tokenId;
                dispatch(postProblem({ userAddress: creator, tokenId }));
                dispatch(postProblem({ userAddress: solver, tokenId }));
              }
              console.log("receipt : ", receipt);
              setLoading(false);
              navigate("/list", { replace: true });
            })
            .catch((err: any) => err);
        } else {
          mintReadmeTokenGo(tokenURI, account, answer, sol)
            .then((receipt: any) => {
              console.log(receipt?.events.returnValues);
              if (receipt.events?.returnValues) {
                const tokenId = receipt?.events.returnValues.tokenId;
                dispatch(postProblem({ userAddress: creator, tokenId }));
                dispatch(postProblem({ userAddress: solver, tokenId }));
              }
              console.log("receipt : ", receipt);
              setLoading(false);
              navigate("/list", { replace: true });
            })
            .catch((err: any) => err);
        }
      }
    };
  };

  useEffect(() => {
    console.log(status);
  }, [status]);

  useEffect(() => {
    return () => {
      window.URL.revokeObjectURL(tmpUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <NewHelmet
        title={`${answer} - 민팅하기`}
        description={`출제자 ${creator}에 의한 리드미-${answer} 문제와 최초 정답자 ${solver}`}
      />
      <div className={styles.container}>
        {loading ? (
          <LoadingPage />
        ) : (
          <div className={styles.mintCard}>
            <img src={tmpUrl} alt="" />
            <div className={styles.content}>
              <div>정답: {answer}</div>
              <div>만든이: {creator}</div>
              <div>맞춘이: {solver}</div>
              <div>임시 URL: {tmpUrl}</div>
            </div>
            <div className={styles.btnBox}>
              <a href={tmpUrl} download>
                다운받기
              </a>
              <button onClick={handleAddItem}>민팅하기</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Mint;
