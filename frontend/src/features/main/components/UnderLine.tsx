import React from "react";
import styles from "../Main.module.css";
interface Under {
  under: string;
}
const UnderLine = ({ under }: Under) => {
  return (
    <div className={styles.underBox}>
      <p
        style={{
          width: under === "left" ? "0px" : "40vw",
          transition: "all 0.3s",
        }}
      />
      <p className={styles.underLine} />
      <p
        style={{
          width: under === "right" ? "0px" : "40vw",
          transition: "all 0.3s",
        }}
      />
    </div>
  );
};

export default UnderLine;
