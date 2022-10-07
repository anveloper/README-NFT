import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectHostUserName, selectParticipants } from "../gameSlice";

import styles from "../Game.module.css";
import { selectUserAddress, truncatedAddress } from "../../auth/authSlice";
const MemberBox = ({ visible }: any) => {
  const participants = useAppSelector(selectParticipants);
  const hostUserName = useAppSelector(selectHostUserName);
  const userAddress = useAppSelector(selectUserAddress);
  return (
    <div
      className={styles.memberBox}
      style={{ display: visible ? "" : "none" }}
    >
      <div className={styles.memberList}>
        {participants.map(
          (p: { address: string; nickname: string }, index: number) => {
            const shortName = truncatedAddress(p.address);
            if (userAddress === p.address)
              return (
                <div key={index} className={styles.memberItemMine}>
                  {`${p.nickname} (나)`}
                  <br />
                  {`${shortName}`}
                </div>
              );
            else if (hostUserName !== p.address)
              return (
                <div key={index} className={styles.memberItem}>
                  {`${p.nickname}`}
                  <br />
                  {`${shortName}`}
                </div>
              );
            else
              return (
                <div key={index} className={styles.memberItemHost}>
                  {`${p.nickname} (HOST)`}
                  <br />
                  {`${shortName}`}
                </div>
              );
          }
        )}
      </div>
    </div>
  );
};

export default MemberBox;
