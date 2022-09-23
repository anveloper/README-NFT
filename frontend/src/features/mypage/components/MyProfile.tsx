import { FC, useEffect, useState } from "react";
// image
import cat from "../../../assets/characters/cat.svg";
import { SSFContract } from "../../../web3Config";
// css
import styles from "../MyPage.module.css";

interface MyProfileProps {
  account: string;
}

const MyProfile: FC<MyProfileProps> = ({ account }) => {
  const [balance, setBalance] = useState(0);

  const getBalance = async () => {
    try {
      const SSFbalance = await SSFContract.methods.balanceOf(account).call();
      setBalance(SSFbalance);
      console.log("balance : ", balance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    console.log(balance);
  }, [balance]);

  return (
    <div className={styles.MyProfile}>
      <div className={styles.MyProfileImgBox}>
        <img className={styles.MyProfileImg} src={cat} alt="" />
      </div>

      <div className={styles.MyProfileTextBox}>
        <h2 className={styles.MyProfileText}>Nickname</h2>
        <h4 className={styles.MyProfileTex}>{account}</h4>
        <h3 className={styles.MyProfileText}>{balance} SSF</h3>
      </div>
    </div>
  );
};

export default MyProfile;
