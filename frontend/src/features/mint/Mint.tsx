import React, { useEffect, FC } from "react";
import { useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
// state
import { selectImgBlob, selectTmpInfo } from "./mintSlice";
// components
import NewHelmet from "../../components/NewHelmet";
import { MintReadmeContract } from "../../web3Config";
import { create } from "ipfs-http-client";

// css
import styles from "./Mint.module.css";
interface MintProps {
  account: string;
}
const ipfsUrl =
  process.env.NODE_ENV !== "production"
    ? "http://j7b108.p.ssafy.io:5001"
    : "https://j7b108.p.ssafy.io";

const Mint: FC<MintProps> = ({ account }) => {
  const { answer, creator, solver, tmpUrl } = useAppSelector(selectTmpInfo);
  const imgBlob: Blob = useAppSelector(selectImgBlob);
  const navigate = useNavigate();
  const addItem = async () => {
    const fr = new FileReader();
    if (account) {
      const client = create({ url: ipfsUrl });
      fr.readAsArrayBuffer(imgBlob);
      fr.onload = async () => {
        if (typeof fr.result !== "string") {
          const cid = await client.add(Buffer.from(fr.result));
          const imageURL = "https://ipfs.io/ipfs/" + cid.path;
          let metadata = {
            fileName: answer,
            name: answer,
            author: creator,
            description: solver,
            imageURL: imageURL,
          };
          const result = await client.add(JSON.stringify(metadata));
          const tokenURI = "https://ipfs.io/ipfs/" + result.path;
          MintReadmeContract.methods
            .create(tokenURI)
            .send({ from: account })
            .then((receipt: any) => {
              console.log(receipt);
              navigate("/list");
            });
        }
      };
    }
  };
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
            <button onClick={addItem}>민팅하기</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mint;
