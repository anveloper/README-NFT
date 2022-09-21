import React, { FC, useEffect, useState } from "react";
import AnimalCard from "./AnimalCard";
import MyAnimalCard, { IMyAnimalCard } from "../components/MyAnimalCard";
import { mintAnimalContract, saleAnimalAddress, saleAnimalContract } from "../../../contracts/index";

interface MyAnimalProps {
  account: String;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<IMyAnimalCard[]>();
  const [saleStatus, setSaleStatus] = useState<boolean>(false);

  const getAnimalTokens = async () => {
    try {
      const balanceLength = await mintAnimalContract.methods.balanceOf(account).call();

      if (balanceLength === "0") return;

      const tempAnimalCardArray: IMyAnimalCard[] = [];
      const response = await mintAnimalContract.methods.getAnimalTokens(account).call();

      response.map((v: IMyAnimalCard) => {
        tempAnimalCardArray.push({ animalTokenId: v.animalTokenId, animalType: v.animalType, animalPrice: v.animalPrice });
      });

      setAnimalCardArray(tempAnimalCardArray);
    } catch (error) {
      console.error(error);
    }
  };

  const getIsApprovedForAll = async () => {
    try {
      const response = await mintAnimalContract.methods.isApprovedForAll(account, saleAnimalAddress).call();
      if (response) {
        setSaleStatus(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onClickApproveToggle = async () => {
    try {
      if (!account) return;
      const response = await mintAnimalContract.methods.setApprovalForAll(saleAnimalAddress, !saleStatus).send({ from: account });
      if (response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!account) return;
    getAnimalTokens();
    getIsApprovedForAll();
  }, [account]);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <p style={{ display: "inline-block" }}>Sale Status : {saleStatus ? "true" : "false"}</p>
        <button onClick={onClickApproveToggle}>{saleStatus ? "Cancel" : "Approve"}</button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
        }}
      >
        {animalCardArray &&
          animalCardArray.map((v, i) => {
            return (
              <MyAnimalCard
                key={i}
                animalTokenId={v.animalTokenId}
                animalType={v.animalType}
                animalPrice={v.animalPrice}
                saleStatus={saleStatus}
                account={account}
              />
            );
          })}
      </div>
    </>
  );
};

export default MyAnimal;
