import { RootState } from "./../../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../api/api";
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
  carouselList: NftConfig[];
  solveList: number[];
  status: "idle" | "loading" | "failed";
}

const initialState: NftListConfig = {
  rawList: [],
  nftList: [],
  carouselList: [],
  solveList: [],
  status: "idle",
};
export const postProblem = createAsyncThunk(
  "nft/postProblem",
  async ({ userAddress, tokenId }: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(api.solver.solveProblem(), {
        walletAddress: userAddress,
        tokenId,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const findSolveList = createAsyncThunk(
  "nft/findSolveList",
  async (userAddress: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(api.solver.getSolveList(userAddress));
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

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
    setCarouselList: (state, { payload }) => {
      state.carouselList = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(findSolveList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(findSolveList.fulfilled, (state, { payload }) => {
        state.status = "idle";
        state.solveList = payload.nftList;
      })
      .addCase(findSolveList.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { setRawList, setCarouselList, setNftList } = nftSlice.actions;

export default nftSlice.reducer;

export const selectRawList = (state: RootState) => state.nft.rawList;
export const selectNftList = (state: RootState) => state.nft.nftList;
export const selectCarouselList = (state: RootState) => state.nft.carouselList;
export const selectSolveList = (state: RootState) => state.nft.solveList;
