import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import styles from "./MainNav.module.css";
interface Props {
  obsNumber: number;
  mainRef: HTMLDivElement[];
  under: any;
  setUnder: any;
}
const MainNav = ({ obsNumber, mainRef, under, setUnder }: Props) => {
  // const { pathname } = useLocation();
  // useEffect(() => {
  //   setMainNav(obsNumber);
  //   console.log(obsNumber);
  //   if (obsNumber > 2) console.log(pathname);
  // }, [obsNumber]);
  useEffect(() => {
    console.log(obsNumber);
    console.log(typeof obsNumber);
  }, [obsNumber]);
  return (
    <div className={styles.btnGroup}>
      <button
        style={
          obsNumber == 1 ? { color: "#fff", backgroundColor: "#e56161cc" } : {}
        }
        className={styles.btn}
        onClick={() => {
          mainRef[0].scrollIntoView({ behavior: "smooth" });
        }}
      >
        TOP
      </button>
      <button
        style={
          obsNumber == 2 ? { color: "#fff", backgroundColor: "#e56161cc" } : {}
        }
        className={styles.btn}
        onClick={() => {
          mainRef[1].scrollIntoView({ behavior: "smooth" });
        }}
      >
        Quiz
      </button>
      <Link to="/live">
        <button
          className={
            obsNumber == 3 && under === "left"
              ? `${styles.btn} ${styles.active}`
              : `${styles.btn}`
          }
          onClick={() => {
            setUnder("left");
            mainRef[2].scrollIntoView({ behavior: "smooth" });
          }}
        >
          Live
        </button>
      </Link>
      <Link to="/list">
        <button
          className={
            obsNumber == 3 && under === "right"
              ? `${styles.btn} ${styles.active}`
              : `${styles.btn}`
          }
          onClick={() => {
            setUnder("right");
            mainRef[2].scrollIntoView({ behavior: "smooth" });
          }}
        >
          NFT
        </button>
      </Link>
    </div>
  );
};

export default MainNav;
