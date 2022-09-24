import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { getDefaultMiddleware } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import gameReducer from "../features/game/gameSlice";
import mintReducer from "../features/mint/mintSlice";
import nftReducer from "../features/nft/nftSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game: gameReducer,
    mint: mintReducer,
    nft: nftReducer,
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
