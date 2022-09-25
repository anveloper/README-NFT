import { RootState } from "./../../app/store";
import { createSlice } from "@reduxjs/toolkit";
export interface Metadata {
  fileName: string;
  name: string;
  author: string;
  description: string;
  imageURL: string;
}

export interface NftConfig {
  metaDataURI: string;
  readmeTokenId: string;
  readmeTokenOwner: string;
  readmeTokenPrice: number;
  metaData: Metadata | undefined;
}

interface NftListConfig {
  rawList: any[];
  nftList: NftConfig[];
}

const initialState: NftListConfig = {
  rawList: [],
  nftList: [],
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    setRawList: (state, { payload }) => {
      state.rawList = payload;
    },
    setNftList: (state, { payload }) => {
      state.nftList = payload;
    },
  },
  extraReducers: {},
});

export const { setRawList, setNftList } = nftSlice.actions;

export default nftSlice.reducer;

export const selectRawList = (state: RootState) => state.nft.rawList;
export const selectNftList = (state: RootState) => state.nft.nftList;
