import React, { FC } from "react";
import { useAppSelector } from "../../app/hooks";
// state
import { selectTmpInfo } from "./mintSlice";
// components
import NewHelmet from "../../components/NewHelmet";
import { mintReadmeContract } from "../../contracts/ReadMe";

interface MintProps {
  account: string;
}

const Mint: FC<MintProps> = ({ account }) => {
  const { answer, creator, solver, tmpUrl } = useAppSelector(selectTmpInfo);

  const onClickMint = async () => {
    if (!account) {
      alert("연결된 계정이 없습니다.");
      return;
    }
    const response = await mintReadmeContract.methods.create(tmpUrl).send({
      from: account,
    });
    console.log(response);
  };

  return (
    <div>
      <NewHelmet title={`${answer} 민팅하기`} description={`출제자 ${creator}에 의한 리드미-${answer} 문제와 최초 정답자 ${solver}`} />
      <img src={tmpUrl} alt="" />
      <div>정답: {answer}</div>
      <div>만든이: {creator}</div>
      <div>맞춘이: {solver}</div>
      <div>임시 URL: {tmpUrl}</div>
      <div>계정: {account}</div>
      <button onClick={onClickMint}>민팅하기</button>
    </div>
  );
};

export default Mint;
