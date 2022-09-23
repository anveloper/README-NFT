import { FC } from "react";
// components
import MyNFTCard from "./MyNFTCard";
// css
import styles from "../MyPage.module.css";
import { MintReadmeContract } from "../../../web3Config";

interface MyNFTListProps {
  NFTListValue: any;
}

const MyNFTList: FC<MyNFTListProps> = ({ NFTListValue }) => {
  const myNFTList = async () => {
    // MintReadmeContract.methods.getOwnedTokens();
  };

  const loveNFTList = async () => {};

  const createNFTList = async () => {};

  if (NFTListValue === "myNFT") {
    console.log("mynft");
    myNFTList();
  } else if (NFTListValue === "loveNFT") {
    console.log("loveNFT");
    loveNFTList();
  } else {
    console.log("createNFT");
    createNFTList();
  }
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
