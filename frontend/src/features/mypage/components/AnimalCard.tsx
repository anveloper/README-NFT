import React, { FC } from "react";

interface AnimalCardProps {
  animalType: String;
}

const AnimalCard: FC<AnimalCardProps> = ({ animalType }) => {
  return (
    <div>
      <img src={require(`../../../assets/nft-img/${animalType}.png`)} alt="AnimalCard" style={{ width: "150px", height: "150px" }} />
    </div>
  );
};

export default AnimalCard;
