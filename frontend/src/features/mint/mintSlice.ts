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
  },
  extraReducers: {},
});

export const { setTmpInfo, setRawData } = mintSlice.actions;

export const selectTmpInfo = (state: RootState) => state.mint.tmpInfo;
export const selectRawData = (state: RootState) => state.mint.rawData;
export default mintSlice.reducer;
