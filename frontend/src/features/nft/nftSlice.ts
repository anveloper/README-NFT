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
  nftList: NftConfig[];
}

const initialState: NftListConfig = {
  nftList: [],
};

const nftSlice = createSlice({
  name: "nft",
  initialState,
  reducers: {
    setNftList: (state, { payload }) => {
      state.nftList = payload;
    },
  },
  extraReducers: {},
});

export const { setNftList } = nftSlice.actions;

export default nftSlice.reducer;

export const selectNftList = (state: RootState) => state.nft.nftList;
