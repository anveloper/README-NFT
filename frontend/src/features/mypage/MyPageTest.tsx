// components
import { FC, useState } from "react";
import MyInfo from "./components/MyInfo";
// css
import styles from "./MyPage.module.css";

interface MyPageTestProps {
  account: string;
}

const MyPageTest: FC<MyPageTestProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<string>();

  const onClickMint = async () => {};
  return (
    <div className={styles.MyPage}>
      {/* <div className={styles.MyProfileInfo}>
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
      </div> */}
    </div>
  );
};

export default MyPageTest;
