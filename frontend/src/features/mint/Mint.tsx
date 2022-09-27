import React, { useEffect, FC } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
// state
import { MintReadmeContract } from "../../web3Config";
import {
  addItem,
  selectImgBlob,
  selectStatus,
  selectTmpInfo,
} from "./mintSlice";
// components
import NewHelmet from "../../components/NewHelmet";
import { create } from "ipfs-http-client";

// css
import styles from "./Mint.module.css";
import Loading from "../../components/loading/Loading";
interface MintProps {
  account: string;
}

const Mint: FC<MintProps> = ({ account }) => {
  const { answer, creator, solver, tmpUrl } = useAppSelector(selectTmpInfo);
  const imgBlob: Blob = useAppSelector(selectImgBlob);
  const status = useAppSelector(selectStatus);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddItem = () => {
    dispatch(addItem({ account, answer, creator, solver, tmpUrl, imgBlob }))
      .then((receipt) => {
        console.log(receipt);
        navigate("/list");
      })
      .catch((err) => console.log(err));
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
      <Loading status={status} />
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
            <button onClick={handleAddItem}>민팅하기</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mint;
