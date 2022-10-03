import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { MintReadmeContract, SaleReadmeContract } from "../../web3Config";
import { selectUserAddress } from "../auth/authSlice";
import styles from "./NftSaleList.module.css";

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
  const navigator = useNavigate();

  const getOnSaleListTokens = async () => {
    try {
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
    <>
      <div className={styles.back}>
        <div className={styles.top_info}>여기</div>
      </div>
      <div className={styles.back}>
        <div className={styles.container}>
          <div className={styles.contents}>
            <div>분류창</div>
            <div>어떤 기준에 분류를 할까</div>
            <div>css는 점차 수정할게요...</div>
          </div>
          <div className={styles.contents}>
            {saleList.map((v: IMyMintList) => {
              return (
                <div className={styles.card_container} key={v.tokenId} onClick={() => navigator("/detail/" + v.tokenId)}>
                  <div className={styles.card}>
                    <div className={styles.img_sq}>
                      <img className={styles.img} src={v.imageURL} alt="NFT이미지" width={300} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default NftSaleList;
