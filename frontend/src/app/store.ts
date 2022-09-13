import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import authReducer from "../features/auth/authSlice";
import gameReducer from "../features/game/gameSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    game: gameReducer,
  },
  // redux에는 직렬화 가는 한 정보만 갖지만,
  // socket을 오브젝트로 저장하기 위해 직렬화를 해제함
  // props로 내려주는 방식도 고민 중
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
