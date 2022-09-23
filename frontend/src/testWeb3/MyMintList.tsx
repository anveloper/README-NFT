import axios from "axios";
import { read } from "fs";
import React, { FC, useEffect, useState , Suspense, lazy} from "react";
import Web3 from "web3";
import COMMON_ABI from "../common/ABI";

interface MyMintListProps {
  account: string;
}

interface IMyMintList {
  tokenId: number;
  fileName: string;
  name: string;
  author: string;
  description: string;
  imageURL: string;
}

const MyMintList: FC<MyMintListProps> = ({ account }) => {
  // Web3
  const web3 = new Web3(
    new Web3.providers.HttpProvider(process.env.REACT_APP_ETHEREUM_RPC_URL)
  );
  const NFTContract = new web3.eth.Contract(
    COMMON_ABI.CONTRACT_ABI.NFT_ABI,
    process.env.REACT_APP_NFT_CA
  );
  // const SSFContract = new web3.eth.Contract(COMMON_ABI.CONTRACT_ABI.ERC_ABI, process.env.REACT_APP_ERC20_CA);

  const [readmeArray, setReadmeArray] = useState<IMyMintList[]>([]);
  const [msg, setMsg] = useState("");

  const getReadmeTokens = async () => {
    try {
      const balanceLength = await NFTContract.methods.balanceOf(account).call();
      if (balanceLength === "0") {
        setMsg("생성된 토큰이 없습니다.");
        return;
      }
      
      const response = await NFTContract.methods.getDrawTokens(account).call();
      console.log(response);
      
      const result: IMyMintList[] = [];
      for (let i = 0; i < response.length; i++) {
        const tokenUrl = await NFTContract.methods.tokenURI(response[i]).call();
        const data: IMyMintList = {
          tokenId: response[i],
          fileName: "",
          name: "",
          author: "",
          description: "",
          imageURL: "",
        };
        await axios(tokenUrl).then((res: any) => {
          data.fileName = res.data.fileName;
          data.name = res.data.name;
          data.author = res.data.author;
          data.description = res.data.description;
          data.imageURL = res.data.imageURL;
        });
        result.push(data);
      }
      setReadmeArray(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;
    getReadmeTokens();
  }, [account]);

  return (
    <div>
      <div>Account: {account}</div>
      <div>{msg}</div>
      <div style={{ display: "flex" }}>
        {readmeArray.map((v: IMyMintList) => {
          console.log(v);
          return (
            <div key={v.tokenId}>
              <img src={v.imageURL} alt="NFT이미지" width={300} />
              <p>{v.fileName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyMintList;
