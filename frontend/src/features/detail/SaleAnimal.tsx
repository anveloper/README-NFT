import React, { FC, useEffect, useState } from "react";
import { IMyAnimalCard } from "../mypage/components/MyAnimalCard";
import SaleAnimalCard from "./SaleAnimalCard";
import { mintAnimalContract, saleAnimalContract } from "../../contracts";

interface SaleAnimalProps {
  account: String;
}

const SaleAnimal: FC<SaleAnimalProps> = ({ account }) => {
  const [saleAnimalCardArray, setsaleAnimalCardArray] = useState<IMyAnimalCard[]>();

  const getOnSaleAnimalTokens = async () => {
    try {
      const onSaleAnimalTokenArrayLength = await saleAnimalContract.methods.getOnSaleAnimalTokenArrayLength().call();
      const tempOnSaleArray: IMyAnimalCard[] = [];
      for (let i = 0; i < parseInt(onSaleAnimalTokenArrayLength); i++) {
        const animalTokenId = await saleAnimalContract.methods.onSaleAnimalTokenArray(i).call();
        const animalType = await mintAnimalContract.methods.animalTypes(animalTokenId).call();
        const animalPrice = await saleAnimalContract.methods.animalTokenPrices(animalTokenId).call();
        tempOnSaleArray.push({ animalTokenId, animalType, animalPrice });
      }
      setsaleAnimalCardArray(tempOnSaleArray);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOnSaleAnimalTokens();
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "5px" }}>
      {saleAnimalCardArray &&
        saleAnimalCardArray.map((v, i) => {
          return (
            <SaleAnimalCard
              key={i}
              animalType={v.animalType}
              animalPrice={v.animalPrice}
              animalTokenId={v.animalTokenId}
              account={account}
              getOnSaleAnimalTokens={getOnSaleAnimalTokens}
            />
          );
        })}
    </div>
  );
};

export default SaleAnimal;
