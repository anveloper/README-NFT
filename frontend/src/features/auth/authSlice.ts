import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import Axios from "../../api/Axios";
import { RootState } from "../../app/store";
import moment from "moment";

export interface AuthState {
  userAddress: string;
  userName: string;
  userAvatar: string;
  isWelcome: boolean;
  status: "idle" | "loading" | "success" | "failed";
  isSSAFY: boolean;
}

const actionNicknameList = [
  "피자먹는",
  "치킨먹는",
  "게임하는",
  "퀴즈푸는",
  "영화보는",
  "노래하는",
  "독서하는",
];
const actionNicknameRandom =
  actionNicknameList[Math.floor(Math.random() * actionNicknameList.length)];

const animalNicknameList = ["방태", "강태", "김태", "박태", "안태", "이태"];
const animalNicknameRandom =
  animalNicknameList[Math.floor(Math.random() * animalNicknameList.length)];

const initialState: AuthState = {
  userAddress: ``,
  userName: `${actionNicknameRandom} ${animalNicknameRandom}`,
  userAvatar: `images/${Math.floor(Math.random() * 50 + 1)}.png`,
  isWelcome: true,
  status: "idle",
  isSSAFY: true,
};

// Smart-contract에 요청할 이름
export const loginUser = createAsyncThunk(
  "auth/getUserAddress",
  // string type으로 들어오지만, axios에 대입할 때 AxiosRequestConfig에 들어갈 값이 any..
  async (loginUserAddress: any, { rejectWithValue }) => {
    try {
      // const response = await Axios.get('/', loginUserAddress);
      const response = { data: loginUserAddress };
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.userAddress = "";
      state.status = "idle";
    },
    login: (state, { payload }) => {
      console.log(payload);
      state.userAddress = payload;
    },
    setIsWelcome: (state) => {
      state.isWelcome = !state.isWelcome;
    },
    setIsSSAFY: (state, { payload }) => {
      state.isSSAFY = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = "success";
        state.userAddress = payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// actions
export const { logoutUser, login, setIsWelcome, setIsSSAFY } =
  authSlice.actions;

// selector
export const selectUserAddress = (state: RootState) => state.auth.userAddress;
export const selectUserName = (state: RootState) => state.auth.userName;
export const selectUserAvatar = (state: RootState) => state.auth.userAvatar;
export const selectIsWelcome = (state: RootState) => state.auth.isWelcome;
export const selectIsSSAFY = (state: RootState) => state.auth.isSSAFY;
export default authSlice.reducer;

// util

export const truncatedAddress = (longAddress: String) => {
  if (!longAddress) return "정답자가 없습니다.";
  if (longAddress.length < 8) return longAddress;
  return `${longAddress.slice(0, 4) + "...." + longAddress.slice(-4)}`;
};

export const change_date = (date: Date) => {
  const transDate = moment(date).format("YYYY/MM/DD HH:mm:ss"); // 날짜 형식 변환
  return transDate;
};
