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
  const [mainNav, setMainNav] = useState(obsNumber ?? 1);
  // const { pathname } = useLocation();
  // useEffect(() => {
  //   setMainNav(obsNumber);
  //   console.log(obsNumber);
  //   if (obsNumber > 2) console.log(pathname);
  // }, [obsNumber]);
  return (
    <div className={styles.btnGroup}>
      <button
        className={
          mainNav === 1 ? `${styles.btn} ${styles.active}` : `${styles.btn}`
        }
        onClick={() => {
          mainRef[0].scrollIntoView({ behavior: "smooth" });
          setMainNav(1);
        }}
      >
        TOP
      </button>
      <button
        className={
          mainNav === 2 ? `${styles.btn} ${styles.active}` : `${styles.btn}`
        }
        onClick={() => {
          mainRef[1].scrollIntoView({ behavior: "smooth" });
          setMainNav(2);
        }}
      >
        Quiz
      </button>
      <Link to="/live">
        <button
          className={
            mainNav === 3 ? `${styles.btn} ${styles.active}` : `${styles.btn}`
          }
          onClick={() => {
            setMainNav(3);
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
            mainNav === 4 ? `${styles.btn} ${styles.active}` : `${styles.btn}`
          }
          onClick={() => {
            setMainNav(4);
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
