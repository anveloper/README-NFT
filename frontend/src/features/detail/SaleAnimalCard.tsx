import React, { FC, useEffect, useState } from "react";
import { mintAnimalContract, saleAnimalContract, web3 } from "../../contracts";
import AnimalCard from "../mypage/components/AnimalCard";

interface SaleAnimalCardProps {
  animalType: string;
  animalPrice: string;
  animalTokenId: string;
  account: String;
  getOnSaleAnimalTokens: () => Promise<void>;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({ animalType, animalPrice, animalTokenId, account, getOnSaleAnimalTokens }) => {
  const [isBuyable, setIsBuyable] = useState<boolean>(false);

  // 토큰 소유자 정보 가져오기.
  const getAnimalTokenOwner = async () => {
    try {
      const response = await mintAnimalContract.methods.ownerOf(animalTokenId).call();
      setIsBuyable(response.toLocaleLowerCase() === account.toLocaleLowerCase());
    } catch (error) {
      console.error(error);
    }
  };

  const onClickBuy = async () => {
    try {
      if (!account) return;
      const response = await saleAnimalContract.methods.purchaseAnimalToken(animalTokenId).send({ from: account, value: animalPrice });
      if (response.status) {
        getOnSaleAnimalTokens();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAnimalTokenOwner();
  }, []);

  return (
    <div style={{ textAlign: "center", width: "150px" }}>
      <AnimalCard animalType={animalType} />
      <div>
        <p style={{ display: "inline-block" }}>{web3.utils.fromWei(animalPrice)} Matic</p>
        <button disabled={isBuyable} onClick={onClickBuy}>
          구매
        </button>
      </div>
    </div>
  );
};

export default SaleAnimalCard;
