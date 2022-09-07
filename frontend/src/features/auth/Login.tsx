import React, { useState, ChangeEvent, KeyboardEvent } from 'react'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { loginUser, logoutUser, selectUserAddress } from './authSlice';
import { Helmet } from 'react-helmet-async';
import styles from './Login.module.css';


const Login = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const [loginUserAddress, setLoginuserAddress] = useState('');
  const dispatch = useAppDispatch();


  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {    
    if (e.key === 'enter') {
      handleSubmit();
    }
  }

  const handleOnChange = (e:ChangeEvent<HTMLInputElement>) => {
    setLoginuserAddress(e.target.value)
  }

  const handleSubmit = () => {
    if (loginUserAddress.length > 0)
      dispatch(loginUser(loginUserAddress));
    else
      alert("입력된 내용이 없습니다.");
  }

  return (
    <div className={styles.row}    >
      <Helmet>
        <title>README login</title>
      </Helmet>
      {userAddress === '' ?
        <>
          <input className={styles.textbox}
            aria-label="Set User Address"
            value={loginUserAddress}
            onKeyPress={ handleKeyPress }
            onChange={handleOnChange}
          />
          <button
            className={ styles.asyncButton }
            onClick={handleSubmit}
          >
            로그인
          </button>
        </>
        :
        <>
          <p className={ styles.textbox }>
            {userAddress}님 안녕하세요.
          </p>
          <button
            className={styles.button}
            onClick={() => { dispatch(logoutUser())}}
          >
            로그아웃
          </button>
        </>
      }      

    </div>
  )
}

export default Login