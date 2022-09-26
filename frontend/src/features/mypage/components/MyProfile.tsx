import { FC, useEffect, useState } from "react";
import { useAppSelector } from "../../../app/hooks";
// image
import cat from "../../../assets/characters/cat.svg";
import { SSFContract } from "../../../web3Config";
import { selectUserName } from "../../auth/authSlice";
// css
import styles from "../MyPage.module.css";

interface MyProfileProps {
  account: string;
}

const MyProfile: FC<MyProfileProps> = ({ account }) => {
  const nickname = useAppSelector(selectUserName);
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
  });

  useEffect(() => {
    setBalance(balance);
  }, [balance]);

  return (
    <div className={styles.MyProfile}>
      <div className={styles.MyProfileImgBox}>
        <img className={styles.MyProfileImg} src={cat} alt="" />
      </div>

      <div className={styles.MyProfileTextBox}>
        <h2 className={styles.MyProfileText}>{nickname}</h2>
        <h4 className={styles.MyProfileTex}>{account}</h4>
        <h3 className={styles.MyProfileText}>{balance} SSF</h3>
      </div>
    </div>
  );
};

export default MyProfile;
