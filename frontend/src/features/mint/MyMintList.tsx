import axios from "axios";
import React, { FC, useEffect, useState } from "react";
import Web3 from "web3";
import { MintReadmeContract } from "../../web3Config";

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

  const [readmeArray, setReadmeArray] = useState<IMyMintList[]>([]);

  const getReadmeTokens = async () => {
    try {
      const balanceLength = await MintReadmeContract.methods.balanceOf(account).call();
      if (balanceLength === "0") {
        return;
      }

      const tempReadmeCardArray: IMyMintList[] = [];
      const response = await MintReadmeContract.methods.getDrawTokens(account).call();

      for (let i = 0; i < response.length; i++) {
        console.log(response[i]);
        const res = await MintReadmeContract.methods.tokenURI(response[i]).call();
        await axios({ url: res })
          .then((data: any) => {
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
      }

      setReadmeArray(tempReadmeCardArray);
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
      <div>
        {readmeArray.map((v: any, i: number) => {
          console.log(v);
          return (
            <div key={i}>
              <img src={v.imageURL} alt="NFT이미지" />
              <div>{v.fileName}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyMintList;
