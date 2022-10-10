import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import LogoImg from "../../assets/logo_img.svg";
import LogoText from "../../assets/logo_text.svg";
import AvatarIMG from "assets/avatar";
// components
import { useAppDispatch, useAppSelector } from "app/hooks";
import {
  selectUserAddress,
  selectUserAvatar,
  selectUserName,
  setIsWelcome,
} from "features/auth/authSlice";
import { CgProfile } from "react-icons/cg";
import { GiPresent } from "react-icons/gi";
import { TbNetwork } from "react-icons/tb";
import { GrGamepad } from "react-icons/gr";

// const isDev = process.env.NODE_ENV !== "production";

const Navbar = ({ mainRef }: any) => {
  // const userAddress = useAppSelector(selectUserAddress);
  const userAvatar = useAppSelector(selectUserAvatar);
  const [modalOpen, setModalOpen] = useState(false);
  const nickname = useAppSelector(selectUserName);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleScroll = () => {
    if (mainRef?.current)
      mainRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.logoBox} onClick={handleScroll}>
        <Link to="/">
          <img className={styles.img1} src={LogoImg} alt="" />
          <img className={styles.img2} src={LogoText} alt="" />
        </Link>
      </div>
      {/* {isDev && (
        <div className={styles.navButtonBox}>
          <Link to="/login">
            <button>로그인</button>
          </Link>
          <Link to="/mypage">
            <button>마이페이지</button>
          </Link>
          <Link to="/test">
            <button>테스트페이지</button>
          </Link>
          <button
            onClick={() => {
              dispatch(setIsWelcome());
            }}
          >
            웰컴페이지
          </button>
          {"개발때만 보여요."}
        </div>
      )} */}
      <div
        className={
          modalOpen
            ? `${styles.profileTag} ${styles.active}`
            : `${styles.profileTag}`
        }
        onClick={() => {
          setModalOpen(!modalOpen);
        }}
      >
        <img src={AvatarIMG[userAvatar]} alt="" className={styles.avatar} />
        {!modalOpen && <p className={styles.nameTag}>{nickname}</p>}
        <div
          className={
            modalOpen
              ? `${styles.moveTab} ${styles.profileOpen}`
              : `${styles.moveTab} ${styles.profileClose}`
          }
        >
          <p>내 리드미</p>
          <Link to="/mypage">
            <CgProfile />
            <p>마이 페이지</p>
          </Link>
          {/* <hr className={styles.underLine} /> */}
          <p>안내 페이지</p>
          <button
            onClick={() => {
              dispatch(setIsWelcome(true));
            }}
            className={styles.profileBtn}
          >
            <GiPresent />
            <p>이벤트 페이지</p>
          </button>
          <hr className={styles.underLine} />
          <Link to="/tutorial">
            <GrGamepad />
            <p>리드미 튜토리얼</p>
          </Link>
          <hr className={styles.underLine} />
          <button
            onClick={() => {
              dispatch(setIsWelcome(true));
              navigate("/guide");
            }}
            className={styles.profileBtn}
          >
            <TbNetwork />
            <p>네트워크 가이드</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
