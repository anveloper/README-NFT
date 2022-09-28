import { RootState } from "./../../app/store";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { create } from "ipfs-http-client";

import { MintReadmeContract } from "../../web3Config";

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

const ipfsUrl =
  process.env.NODE_ENV !== "production"
    ? "http://j7b108.p.ssafy.io:5001"
    : "https://j7b108.p.ssafy.io";

export const addItem = createAsyncThunk(
  "mint/addItem",
  async ({ account, answer, creator, solver, tmpUrl, imgBlob }: any) => {
    const fr = new FileReader();
    if (account) {
      const client = create({ url: ipfsUrl });
      fr.readAsArrayBuffer(imgBlob);
      fr.onload = async () => {
        if (typeof fr.result !== "string") {
          const cid = await client.add(Buffer.from(fr.result));
          const imageURL = "https://ipfs.io/ipfs/" + cid.path;
          let metadata = {
            fileName: answer,
            name: answer,
            author: creator,
            description: solver,
            imageURL: imageURL,
          };
          const result = await client.add(JSON.stringify(metadata));
          const tokenURI = "https://ipfs.io/ipfs/" + result.path;
          MintReadmeContract.methods
            .create(tokenURI, process.env.REACT_APP_SALEREADMETOKEN_CA)
            .send({ from: account })
            .then((receipt: any) => receipt)
            .catch((err: any) => err);
        }
      };
    }
  }
);
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
  extraReducers: (builder) => {
    builder
      .addCase(addItem.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.status = "idle";
      })
      .addCase(addItem.rejected, (state, action) => {
        state.status = "failed";
      });
  },
});

export const { setTmpInfo, setRawData, setImgBlob } = mintSlice.actions;
export const selectStatus = (state: RootState) => state.mint.status;
export const selectTmpInfo = (state: RootState) => state.mint.tmpInfo;
export const selectRawData = (state: RootState) => state.mint.rawData;
export const selectImgBlob = (state: RootState) => state.mint.imgBlob;
export default mintSlice.reducer;
