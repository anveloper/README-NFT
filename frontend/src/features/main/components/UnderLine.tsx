import React from "react";
import { useLocation } from "react-router-dom";
import styles from "../Main.module.css";
interface Under {
  under: string;
}
const UnderLine = ({ under }: Under) => {
  const { pathname } = useLocation();
  const un = pathname !== "/list" ? "left" : under;
  return (
    <div className={styles.underBox}>
      <p
        style={{
          width: un === "left" ? "0px" : "40vw",
          transition: "all 0.3s",
        }}
      />
      <p className={styles.underLine} />
      <p
        style={{
          width: un === "right" ? "0px" : "40vw",
          transition: "all 0.3s",
        }}
      />
    </div>
  );
};

export default UnderLine;
