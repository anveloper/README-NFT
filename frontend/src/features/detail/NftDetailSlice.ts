import { createSlice } from "@reduxjs/toolkit";
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
};

const NftDetailSlice = createSlice({
  name: "detail",
  initialState,
  reducers: {
    setNftDetail: (
      state,
      { payload: { fileName, name, author, description, imageURL } }
    ) => {
      state.metaData = { fileName, name, author, description, imageURL };
    },
  },
});
export const { setNftDetail } = NftDetailSlice.actions;
export const selectNftDetail = (state: RootState) => state.detail.metaData;
export default NftDetailSlice.reducer;
