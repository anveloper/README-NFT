import React, { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
// state
import { selectTmpInfo } from "./mintSlice";
// components
import NewHelmet from "../../components/NewHelmet";

const Mint = () => {
  const { answer, creator, solver, tmpUrl } = useAppSelector(selectTmpInfo);
  useEffect(() => {
    return () => {
      window.URL.revokeObjectURL(tmpUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <NewHelmet
        title={`${answer} - 민팅하기`}
        description={`출제자 ${creator}에 의한 리드미-${answer} 문제와 최초 정답자 ${solver}`}
      />
      <img src={tmpUrl} alt="" />
      <div>정답: {answer}</div>
      <div>만든이: {creator}</div>
      <div>맞춘이: {solver}</div>
      <div>임시 URL: {tmpUrl}</div>
    </div>
  );
};

export default Mint;
