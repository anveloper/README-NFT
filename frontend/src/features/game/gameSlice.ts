import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { RootState } from "../../app/store";

export interface RoomConfig {
  title: string;
  host: string;
  cnt: number;
}
export interface GameState {
  roomList: RoomConfig[];
  socket: Socket | undefined;
  hostUserName: string;
  roomName: string;
  roomCnt: number;
  answer: string;
  color: string;
  status: "idle" | "loading" | "failed";
}

const initialState: GameState = {
  roomList: [{ title: "asdf", host: "asdf", cnt: 3 }],
  socket: undefined,
  hostUserName: "",
  roomName: "",
  roomCnt: 0,
  answer: "",
  color: "",
  status: "idle",
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setSocket: (state, { payload }) => {
      state.socket = payload;
    },
    setRoomList: (state, { payload }) => {
      state.roomList = payload;
    },
    setRoomInfo: (state, { payload }) => {
      state.roomName = payload.roomName;
      state.hostUserName = payload.hostUserName;
      state.roomCnt = payload.roomCnt;
    },
  },
  extraReducers: {},
});

export const { setSocket, setRoomList, setRoomInfo } = gameSlice.actions;
export const selectSocket = (state: RootState) => state.game.socket;
export const selectRoomList = (state: RootState) => state.game.roomList;

export default gameSlice.reducer;
