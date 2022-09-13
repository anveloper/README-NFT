import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { RootState } from "../../app/store";

export interface GameState {
  roomList: [];
  socket: Socket | undefined;
  userName: string;
  roomName: string;
  answer: string;
  color: string;
  status: "idle" | "loading" | "failed";
}

const initialState: GameState = {
  roomList: [],
  socket: undefined,
  userName: "",
  roomName: "",
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
  },
  extraReducers: {},
});

export const { setSocket, setRoomList } = gameSlice.actions;

export const selectSocket = (state: RootState) => state.game.socket;

export default gameSlice.reducer;
