import { RootState } from "./../../app/store";
import { createSlice } from "@reduxjs/toolkit";

interface MintConfig {
  tmpInfo: {
    answer: string;
    creator: string;
    solver: string;
    tmpUrl: string;
  };
  rawData: string;
  imgBlob: Blob | undefined;
  ipfsUrl: string;
  tokenAddress: string;
  status: "idle" | "loading" | "failed";
}

const initialState: MintConfig = {
  tmpInfo: {
    answer: "",
    creator: "",
    solver: "",
    tmpUrl: "",
  },
  rawData: "",
  imgBlob: undefined,
  ipfsUrl: "",
  tokenAddress: "",
  status: "idle",
};

export const mintSlice = createSlice({
  name: "mint",
  initialState,
  reducers: {
    setTmpInfo: (state, { payload: { answer, creator, solver, tmpUrl } }) => {
      state.tmpInfo = { answer, creator, solver, tmpUrl };
    },
    setRawData: (state, { payload }) => {
      state.rawData = payload;
    },
    setImgBlob: (state, { payload }) => {
      state.imgBlob = payload;
    },
  },
  extraReducers: {},
});

export const { setTmpInfo, setRawData, setImgBlob } = mintSlice.actions;

export const selectTmpInfo = (state: RootState) => state.mint.tmpInfo;
export const selectRawData = (state: RootState) => state.mint.rawData;
export const selectImgBlob = (state: RootState) => state.mint.imgBlob;
export default mintSlice.reducer;
