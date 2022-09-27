import React, { useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectUserAddress } from "../auth/authSlice";

const NftSaleList = () => {
  const userAddress = useAppSelector(selectUserAddress);
  const [saleList, setSaleList] = useState([]);

  const getOnSaleListTokens = async () => {
    try {
      
    } catch (error) {
      console.log(error);
    }
  };

  return <div>{userAddress}</div>;
};

export default NftSaleList;
