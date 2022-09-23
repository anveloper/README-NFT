import React, { useEffect, FC, useState, useRef } from "react";
import { useAppSelector } from "../../app/hooks";
// state
import { selectTmpInfo } from "./mintSlice";
// components
import NewHelmet from "../../components/NewHelmet";
import { MintReadmeContract } from "../../web3Config";
import { create } from "ipfs-http-client";

interface MintProps {
  account: string;
}

const Mint: FC<MintProps> = ({ account }) => {
  const { answer, creator, solver, tmpUrl } = useAppSelector(selectTmpInfo);
  // setItem(tmpUrl);

  const convertURLtoFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split(".").pop(); // url 구조에 맞게 수정할 것
    const filename = url.split("/").pop(); // url 구조에 맞게 수정할 것
    const metadata = { type: `image/${ext}` };
    return new File([data], filename!, metadata);
  };

  const addItem = async () => {
    const client = create({ url: "https://" + process.env.REACT_APP_IPFS_IP });
    console.log(client);
    // const imageURL = "https://ipfs.io/ipfs/" + tmpUrl;
    // console.log(convertURLtoFile(tmpUrl));
    console.log("왜 뜨냐고 ");
    let metaData = {
      answer: answer,
      creator: creator,
      solver: solver,
      tmpUrl: tmpUrl,
    };
    console.log(JSON.stringify(metaData));
    // const response = await client.add(Buffer.from(JSON.stringify(metaData)), (err, res) => {
    //   let tokenURI = "https://ipfs.io/ipfs/" + res[0].hash;
    //   console.log(tokenURI);
    // });
    // client.add("Hello World").then((res) => {
    //   console.log(res);
    // });
    const response = await client.add(JSON.stringify(metaData));
    console.log(response);
  };

  useEffect(() => {
    return () => {
      // window.URL.revokeObjectURL(tmpUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div>
      <NewHelmet title={`${answer} - 민팅하기`} description={`출제자 ${creator}에 의한 리드미-${answer} 문제와 최초 정답자 ${solver}`} />
      <img src={tmpUrl} alt="" />
      <div>정답: {answer}</div>
      <div>만든이: {creator}</div>
      <div>맞춘이: {solver}</div>
      <div>임시 URL: {tmpUrl}</div>
      {/* <div>계정: {account}</div> */}

      <button onClick={addItem}>민팅하기</button>
    </div>
  );
};

export default Mint;
