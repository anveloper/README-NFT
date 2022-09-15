import React, { useEffect, useRef } from "react";

import styles from "./Main.module.css";
const NFTList = () => {
  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    listRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, []);
  return (
    <div className={styles.listContainer} ref={listRef}>
      NFTList
    </div>
  );
};

export default NFTList;
