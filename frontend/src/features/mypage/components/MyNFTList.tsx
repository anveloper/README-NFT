import { FC, useEffect, useState } from "react";
// components
import MyNFTCard, { IMyNFTCard } from "./MyNFTCard";
// css
import styles from "../MyPage.module.css";
import { GetReadmeContract } from "../../../web3Config";
import { useAppSelector } from "../../../app/hooks";
import { selectUserAddress } from "../../auth/authSlice";
import axios from "axios";
import api from "../../../api/api";

interface MyNFTListProps {
  NFTListValue: any;
}

const MyNFTList: FC<MyNFTListProps> = ({ NFTListValue }) => {
  const walletAddress = useAppSelector(selectUserAddress);
  const [NFTCardArray, setNFTCardArray] = useState<IMyNFTCard[]>([]);

  const myNFTList = async () => {
    try {
      const tempNFTCardArray: IMyNFTCard[] = [];

      const response = await GetReadmeContract.methods
        .getMyReadmeToken(walletAddress)
        .call();
      console.log(response);

      response.map((v: IMyNFTCard) => {
        tempNFTCardArray.push({
          tokenId: v.tokenId,
          price: v.price,
          owner: v.owner,
          metadataURI: v.metadataURI,
        });
      });
      console.log("card : ", tempNFTCardArray);
      setNFTCardArray([]);
      setNFTCardArray(tempNFTCardArray);
    } catch (error) {
      console.error(error);
    }
  };

  const likeNFTList = async () => {
    axios
      .get(api.like.likeNFTList(walletAddress))
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createNFTList = async () => {
    try {
      const tempNFTCardArray: IMyNFTCard[] = [];

      const response = await GetReadmeContract.methods
        .getDrawReadmeToken(walletAddress)
        .call();
      console.log(response);

      response.map((v: IMyNFTCard) => {
        tempNFTCardArray.push({
          tokenId: v.tokenId,
          price: v.price,
          owner: v.owner,
          metadataURI: v.metadataURI,
        });
      });
      console.log("card : ", tempNFTCardArray);
      setNFTCardArray(tempNFTCardArray);
    } catch (error) {
      console.error(error);
    }
  };

  if (NFTListValue === "myNFT") {
    console.log("mynft");
    myNFTList();
  } else if (NFTListValue === "loveNFT") {
    console.log("loveNFT");
    likeNFTList();
  } else if (NFTListValue === "createNFT") {
    console.log("createNFT");
    createNFTList();
  }

  // useEffect(() => {
  //   console.log(NFTCardArray);
  // }, [NFTCardArray]);

  return (
    <div className={styles.MyNFTList}>
      <select name="" id="">
        <option value="sort">Sort</option>
        <option value="">이름순</option>
        <option value="">가격순</option>
      </select>

      <div className={styles.MyNFTCardList}>
        {/* <MyNFTCard />
        <MyNFTCard /> */}
        {NFTCardArray &&
          NFTCardArray.map((v, i) => {
            return (
              <MyNFTCard
                key={i}
                tokenId={v.tokenId}
                price={v.price}
                owner={v.owner}
                metadataURI={v.metadataURI}
              />
            );
          })}
      </div>
    </div>
  );
};

export default MyNFTList;

/*
{<AnimalCard animalType={newAnimalType} />}

return (
    <div className={styles.MyNFTList}>
      <select name="" id="">
        <option value="sort">Sort</option>
        <option value="">이름순</option>
        <option value="">가격순</option>
      </select>

      <div className={styles.MyNFTCardList}>
        <MyNFTCard />
        <MyNFTCard />
      </div>
      <div className={styles.MyNFTCardList}>
        <MyNFTCard />
        <MyNFTCard />
      </div>
    </div>
  );
*/
