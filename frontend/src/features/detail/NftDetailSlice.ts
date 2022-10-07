import { createSlice } from "@reduxjs/toolkit";
import { Root } from "react-dom/client";
import { RootState } from "../../app/store";
import { NftConfig } from "../nft/nftSlice";

const initialState: NftConfig = {
  metaDataURI: "",
  readmeTokenId: "",
  readmeTokenOwner: "",
  readmeTokenPrice: 0,
  isActive: true,
  metaData: {
    fileName: "",
    name: "",
    author: "",
    description: "",
    imageURL: "",
  },

  // (정현) 구체적인 날짜 출력 기능 일시 보류
  // saleDate: {
  //   saleStartDay: new Date(),
  //   saleEndDay: new Date(),
  // },
};

const NftDetailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setNftDetail: (state, { payload: { fileName, name, author, description, imageURL } }) => {
      state.metaData = { fileName, name, author, description, imageURL };
    },
    setNftPrice: (state, { payload }) => {
      state.readmeTokenPrice = payload;
    },
    setNftOwner: (state, { payload }) => {
      state.readmeTokenOwner = payload;
    },
    setIsActive: (state, { payload }) => {
      state.isActive = payload;
    },
    // setSaleDate: (state, { payload: { saleStartDay, saleEndDay } }) => {
    //   state.saleDate = { saleStartDay, saleEndDay };
    // },
  },
});
export const { setNftDetail, setNftPrice, setNftOwner, setIsActive } = NftDetailSlice.actions;
export const selectNftDetail = (state: RootState) => state.detail.metaData;
export const selectNftPrice = (state: RootState) => state.detail.readmeTokenPrice;
export const selectNftOwner = (state: RootState) => state.detail.readmeTokenOwner;
export const selectIsActive = (state: RootState) => state.detail.isActive;
export default NftDetailSlice.reducer;
