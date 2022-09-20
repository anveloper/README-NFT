import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";
import { RootState } from "../../app/store";

export interface RoomConfig {
  title: string;
  host: string;
  cnt: number;
}
export interface ChatConfig {
  type: "other" | "mine" | "system";
  name: string;
  msg: string;
}
export interface GameState {
  roomList: RoomConfig[];
  socket: Socket | undefined;
  hostUserName: string;
  roomName: string;
  roomCnt: number;
  answer: string;
  color: string;
  messages: ChatConfig[];
  timeover: boolean;
  started: boolean;
  status: "idle" | "loading" | "failed";
}

const initialState: GameState = {
  roomList: [{ title: "asdf", host: "asdf", cnt: 3 }],
  socket: undefined,
  hostUserName: "",
  roomName: "",
  roomCnt: 0,
  answer: "",
  color: "#000000",
  messages: [{ type: "system", name: "관리자", msg: "대화를 시작합니다." }],
  timeover: false,
  started: true,
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
    setRoomCnt: (state, { payload }) => {
      state.roomCnt = payload;
    },
    setRoomInfo: (state, { payload }) => {
      state.roomName = payload.roomName;
      state.hostUserName = payload.hostUserName;
      state.roomCnt = payload.roomCnt;
    },
    setColor: (state, { payload }) => {
      state.color = payload;
    },
    setMessages: (state, { payload: { type, name, msg } }) => {
      state.messages.push({ type, name, msg });
    },
    resetRoomInfo: (state) => {
      state.hostUserName = "";
      state.roomName = "";
      state.roomCnt = 0;
      state.answer = "";
      state.color = "#000000";
      state.messages = [
        { type: "system", name: "관리자", msg: "대화를 시작합니다." },
      ];
    },
    setTimeover: (state) => {
      state.timeover = !state.timeover;
    },
    setStarted: (state) => {
      state.started = !state.started;
    },
  },
  extraReducers: {},
});
// redusers
export const {
  setSocket,
  setRoomList,
  setRoomCnt,
  setRoomInfo,
  setColor,
  setMessages,
  resetRoomInfo,
  setTimeover,
  setStarted,
} = gameSlice.actions;
// selector
export const selectSocket = (state: RootState) => state.game.socket;
export const selectRoomName = (state: RootState) => state.game.roomName;
export const selectHostUserName = (state: RootState) => state.game.hostUserName;
export const selectRoomCnt = (state: RootState) => state.game.roomCnt;
export const selectRoomList = (state: RootState) => state.game.roomList;
export const selectMessages = (state: RootState) => state.game.messages;
export const selectColor = (state: RootState) => state.game.color;
export const selectTimeover = (state: RootState) => state.game.timeover;
export const selectStarted = (state: RootState) => state.game.started;
export const MSG = (type: string, name: string, msg: string) => {
  return { type: type, name: name, msg: msg };
};
export default gameSlice.reducer;
