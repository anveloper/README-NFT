import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface RoomConfig {
  title: string;
  host: string;
  cnt: number;
}
export interface ChatConfig {
  type: "other" | "mine" | "system" | "noti";
  name: string;
  msg: string;
}
export interface participantConfig {
  socketId: string;
  nickname: string;
  address: string;
}
export interface GameState {
  roomList: RoomConfig[];
  hostUserName: string;
  roomName: string;
  roomCnt: number;
  answer: string;
  answerLength: number;
  color: string;
  messages: ChatConfig[];
  timeover: boolean;
  started: boolean;
  solver: string;
  solversCnt: number;
  participants: participantConfig[];
  status: "idle" | "loading" | "failed";
  view: number;
}
const initChat: ChatConfig[] = [
  { type: "system", name: "관리자", msg: "대화를 시작합니다." },
  {
    type: "noti",
    name: "관리중인 방태",
    msg: "제시어를 입력하면 게임이 시작되며, 캔버스가 초기화 됩니다. 게임 시작 후에는 호스트만 그림을 그릴 수 있습니다.",
  },
];
const initialState: GameState = {
  roomList: [
    { title: "asdf", host: "asdf", cnt: 1 },
    { title: "zxcv zxcv", host: "asdf", cnt: 3 },
    { title: "asdf", host: "asdf", cnt: 4 },
    { title: "xczv", host: "asdf", cnt: 5 },
  ],
  hostUserName: "",
  roomName: "",
  roomCnt: 0,
  answer: "",
  answerLength: 0,
  color: "#000000",
  messages: initChat,
  timeover: false,
  started: false,
  solver: "",
  solversCnt: 0,
  participants: [],
  status: "idle",
  view: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
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
      state.answerLength = payload.answerLength;
      state.participants = payload.participants;
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
      state.messages = initChat;
      state.timeover = false;
      state.started = false;
      state.solver = "";
    },
    setAnswer: (state, { payload }) => {
      state.answer = payload;
    },
    setAnswerLength: (state, { payload }) => {
      state.answerLength = payload;
    },
    setTimeover: (state, { payload }) => {
      state.timeover = payload;
    },
    setStarted: (state, { payload }) => {
      state.started = payload;
    },
    setSolvers: (state, { payload: { solver, solversCnt, roomCnt } }) => {
      state.solver = solver;
      state.solversCnt = solversCnt;
      state.roomCnt = roomCnt;
    },
    setSolver: (state, { payload }) => {
      state.solver = payload;
    },
    setParticipants: (state, { payload }) => {
      state.participants = payload;
    },
    setView: (state, { payload }) => {
      state.view = payload;
    },
  },
  extraReducers: {},
});
// redusers
export const {
  setRoomList,
  setRoomCnt,
  setRoomInfo,
  setColor,
  setMessages,
  resetRoomInfo,
  setAnswer,
  setAnswerLength,
  setTimeover,
  setStarted,
  setSolvers,
  setSolver,
  setParticipants,
  setView,
} = gameSlice.actions;
// selector
export const selectRoomName = (state: RootState) => state.game.roomName;
export const selectHostUserName = (state: RootState) => state.game.hostUserName;
export const selectRoomCnt = (state: RootState) => state.game.roomCnt;
export const selectRoomList = (state: RootState) => state.game.roomList;
export const selectMessages = (state: RootState) => state.game.messages;
export const selectColor = (state: RootState) => state.game.color;
export const selectAnswer = (state: RootState) => state.game.answer;
export const selectAnswerLength = (state: RootState) => state.game.answerLength;
export const selectTimeover = (state: RootState) => state.game.timeover;
export const selectStarted = (state: RootState) => state.game.started;
export const selectSolver = (state: RootState) => state.game.solver;
export const selectSolversCnt = (state: RootState) => state.game.solversCnt;
export const selectParticipants = (state: RootState) => state.game.participants;
export const MSG = (type: string, name: string, msg: string) => {
  return { type: type, name: name, msg: msg };
};
export default gameSlice.reducer;

export const sview = (state: RootState) => state.game.view;
