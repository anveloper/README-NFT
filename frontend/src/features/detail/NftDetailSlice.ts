import { createSlice } from "@reduxjs/toolkit";
import { Root } from "react-dom/client";
import { RootState } from "../../app/store";
import { NftConfig } from "../nft/nftSlice";

const initialState: NftConfig = {
  metaDataURI: "",
  readmeTokenId: "",
  readmeTokenOwner: "",
  readmeTokenPrice: 0,
  metaData: {
    fileName: "",
    name: "",
    author: "",
    description: "",
    imageURL: "",
  },
  saleDate: {
    saleStartDay: new Date(),
    saleEndDay: new Date(),
  },
};

const NftDetailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setNftDetail: (state, { payload: { fileName, name, author, description, imageURL } }) => {
      state.metaData = { fileName, name, author, description, imageURL };
    },
    setNftInfo: (state, { payload: { readmeTokenId, readmeTokenOwner, readmeTokenPrice } }) => {
      state.readmeTokenId = readmeTokenId;
      state.readmeTokenOwner = readmeTokenOwner;
      state.readmeTokenPrice = readmeTokenPrice;
    },
    setNftPrice: (state, { payload }) => {
      state.readmeTokenPrice = payload;
    },
    setNftOwner: (state, { payload }) => {
      state.readmeTokenOwner = payload;
    },
    setSaleDate: (state, { payload: { saleStartDay, saleEndDay } }) => {
      state.saleDate = { saleStartDay, saleEndDay };
    },
  },
});
export const { setNftDetail, setNftPrice, setNftOwner, setSaleDate } = NftDetailSlice.actions;
export const selectNftDetail = (state: RootState) => state.detail.metaData;
export const selectNftPrice = (state: RootState) => state.detail.readmeTokenPrice;
export const selectNftOwner = (state: RootState) => state.detail.readmeTokenOwner;
export const selectSaleDate = (state: RootState) => state.detail.saleDate;
export default NftDetailSlice.reducer;
