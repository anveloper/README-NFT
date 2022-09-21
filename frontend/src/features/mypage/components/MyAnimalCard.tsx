import React, { ChangeEvent, FC, useState } from "react";
import { saleAnimalAddress, saleAnimalContract, web3 } from "../../../contracts/index";
import AnimalCard from "./AnimalCard";

export interface IMyAnimalCard {
  animalTokenId: string;
  animalType: string;
  animalPrice: string;
}

interface MyAnimalCardProps extends IMyAnimalCard {
  saleStatus: boolean;
  account: String;
}

const MyAnimalCard: FC<MyAnimalCardProps> = ({ animalTokenId, animalType, animalPrice, saleStatus, account }) => {
  const [sellPrice, setSellPrice] = useState<string>("");
  const [myAnimalPrice, setMyAnimalPrice] = useState<string>(animalPrice);
  const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setSellPrice(e.target.value);
  };
  const onClickSell = async () => {
    try {
      if (!account || !saleStatus) return;
      const response = await saleAnimalContract.methods.setForSaleAnimalToken(animalTokenId, web3.utils.toWei(sellPrice, "ether")).send({ from: account });
      if (response.status) {
        setMyAnimalPrice(web3.utils.toWei(sellPrice, "ether"));
      }
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ textAlign: "center", width: "150px" }}>
      <AnimalCard animalType={animalType} />
      <div style={{ marginTop: "2px" }}>
        {myAnimalPrice === "0" ? (
          <>
            <input type="Number" value={sellPrice} onChange={onChangeSellPrice} />
            <button onClick={onClickSell}>등록</button>
          </>
        ) : (
          <span style={{ display: "inline-block" }}>{web3.utils.fromWei(myAnimalPrice)} Matic</span>
        )}
      </div>
    </div>
  );
};

export default MyAnimalCard;
