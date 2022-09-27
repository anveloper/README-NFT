import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { selectUserAddress } from "../auth/authSlice";

interface IMyMintList {
  tokenId: number;
  fileName: string;
  name: string;
  author: string;
  description: string;
  imageURL: string;
}

const NftSaleList = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const [saleList, setSaleList] = useState<IMyMintList[]>([]);

  const getOnSaleListTokens = async () => {
    try {
      // const response = await SaleReadmeContract.methods.getOnSaleReadmeTokenArrayLength().call();
      const response = await SaleReadmeContract.methods.getOnSaleReadmeToken().call();
      const tmpSaleList: IMyMintList[] = [];
      for (let i = 0; i < response.length; i++) {
        const tokenUrl = await MintReadmeContract.methods.tokenURI(response[i]).call();
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
        tmpSaleList.push(data);
      }
      setSaleList(tmpSaleList);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOnSaleListTokens();
  }, []);

  return (
    <div>
      {userAddress}
      <div style={{ display: "flex" }}>
        {saleList.map((v: IMyMintList) => {
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

export default NftSaleList;
