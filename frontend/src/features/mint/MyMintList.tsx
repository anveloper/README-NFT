import axios from "axios";
import { read } from "fs";
import React, { FC, useEffect, useState } from "react";
import Web3 from "web3";
import COMMON_ABI from "../../common/ABI";

interface MyMintListProps {
  account: string;
}

interface IMyMintList {
  fileName: string;
  name: string;
  author: string;
  description: string;
  imageURL: string;
}

const MyMintList: FC<MyMintListProps> = ({ account }) => {
  // Web3
  const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_ETHEREUM_RPC_URL));
  const NFTContract = new web3.eth.Contract(COMMON_ABI.CONTRACT_ABI.NFT_ABI, process.env.REACT_APP_NFT_CA);
  // const SSFContract = new web3.eth.Contract(COMMON_ABI.CONTRACT_ABI.ERC_ABI, process.env.REACT_APP_ERC20_CA);

  const [readmeArray, setReadmeArray] = useState<IMyMintList[]>([]);
  const [msg, setMsg] = useState("");
  const [imgFile, setImgFile] = useState("");

  const tempReadmeCardArray: IMyMintList[] = [];
  const getReadmeTokens = async () => {
    try {
      const balanceLength = await NFTContract.methods.balanceOf(account).call();
      if (balanceLength === "0") {
        setMsg("생성된 토큰이 없습니다.");
        return;
      }

      const response = await NFTContract.methods.getDrawTokens(account).call();
      console.log(response);

      for (let i = 0; i < response.length; i++) {
        getToken(response[i]);
      }

      setReadmeArray(tempReadmeCardArray);
      console.log(readmeArray);
    } catch (error) {
      console.error(error);
    }
  };

  const getToken = async (tokenId: any) => {
    const response = await NFTContract.methods.tokenURI(tokenId).call();
    // console.log(tokenId);
    // console.log(response);

    axios({ url: response })
      .then((data: any) => {
        // console.log(data.data.imageURL);
        tempReadmeCardArray.push({
          fileName: data.data.fileName,
          name: data.data.name,
          author: data.data.author,
          description: data.data.description,
          imageURL: data.data.imageURL,
        });
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (!account) return;
    getReadmeTokens();
  }, [account]);

  return (
    <div>
      <div>Account: {account}</div>
      <div>
        {readmeArray.map((v: any) => {
          console.log(v);
          return (
            <div>
              <img src={v.imageURL} alt="NFT이미지" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyMintList;
