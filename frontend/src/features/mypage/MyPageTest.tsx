// components
import { FC, useState } from "react";
import { mintAnimalContract } from "../../contracts";
import AnimalCard from "./components/AnimalCard";
import MyAnimal from "./components/MyAnimal";
import MyInfo from "./components/MyInfo";
// css
import styles from "./MyPage.module.css";

interface MyPageTestProps {
  account: string;
}

const MyPageTest: FC<MyPageTestProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<string>();

  const onClickMint = async () => {
    try {
      console.log("들어옴");
      if (!account) return; // 계정이 없는 경우.
      const response = await mintAnimalContract.methods
        .mintAnimalToken()
        .send({ from: account });
      console.log(response);
      if (response.status) {
        const balanceLength = await mintAnimalContract.methods
          .balanceOf(account)
          .call();
        const animalTokenId = await mintAnimalContract.methods
          .tokenOfOwnerByIndex(account, parseInt(balanceLength.length, 10) - 1)
          .call();
        const animalType = await mintAnimalContract.methods
          .animalTypes(animalTokenId)
          .call();
        setNewAnimalType(animalType);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={styles.MyPage}>
      <div className={styles.MyProfileInfo}>
        <MyInfo account={account} />
      </div>

      <div style={{ paddingRight: "20px" }}>
        <div>
          {newAnimalType ? (
            <div>{<AnimalCard animalType={newAnimalType} />}</div>
          ) : (
            <p>Mint Card</p>
          )}
        </div>
        <button onClick={onClickMint}>Mint</button>
      </div>

      <div className={styles.MyNFTView}>
        <MyAnimal account={account} />
      </div>
    </div>
  );
};

export default MyPageTest;
