import {createSlice} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { NftConfig} from "../nft/nftSlice"

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
}

const NftDetailSlice = createSlice({
    name: "detail",
    initialState,
    reducers: {
        setNftDetail: (state, {payload: {fileName, name, author, description, imageURL} }) => {
            state.metaData = {fileName, name, author, description, imageURL}
        },
        setNftInfo: (state, {payload: {readmeTokenId, readmeTokenPrice, readmeTokenOwner}} ) => {
            state.readmeTokenId = readmeTokenId;
            state.readmeTokenPrice = readmeTokenPrice;
            state.readmeTokenOwner = readmeTokenOwner;
        }
        
    }
})
export const {setNftDetail, setNftInfo} = NftDetailSlice.actions;
export const selectNftDetail = (state: RootState) => state.detail.metaData;
export const selectNftPrice = (state: RootState) => state.detail.readmeTokenPrice;
export const selectNftOwner = (state: RootState) => state.detail.readmeTokenOwner;
export default NftDetailSlice.reducer;