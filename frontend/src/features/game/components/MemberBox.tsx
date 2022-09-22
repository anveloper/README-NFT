import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectHostUserName, selectParticipants } from "../gameSlice";

import styles from "../Game.module.css";
import { selectUserAddress } from "../../auth/authSlice";
const MemberBox = ({ visible }: any) => {
  const participants = useAppSelector(selectParticipants);
  const hostUserName = useAppSelector(selectHostUserName);
  const userAddress = useAppSelector(selectUserAddress);
  console.log(participants);
  return (
    <div
      className={styles.memberBox}
      style={{ display: visible ? "" : "none" }}
    >
      <div className={styles.memberList}>
        {participants.map((p, index) => {
          if (userAddress === p.address)
            return (
              <div key={index} className={styles.memberItemMine}>
                {`${p.nickname} (나)`}
                <br />
                {`${p.address}`}
              </div>
            );
          else if (hostUserName !== p.address)
            return (
              <div key={index} className={styles.memberItem}>
                {`${p.nickname}`}
                <br />
                {`${p.address}`}
              </div>
            );
          else
            return (
              <div key={index} className={styles.memberItemHost}>
                {`${p.nickname} (HOST)`}
                <br />
                {`${p.address}`}
              </div>
            );
        })}
      </div>
    </div>
  );
};

export default MemberBox;
