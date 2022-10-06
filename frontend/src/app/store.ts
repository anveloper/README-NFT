// core
import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

// reducers
import authReducer from "../features/auth/authSlice";
import gameReducer from "../features/game/gameSlice";
import mintReducer from "../features/mint/mintSlice";
import nftReducer from "../features/nft/nftSlice";
import detailReducer from "../features/detail/NftDetailSlice";

const reducers = combineReducers({
  auth: authReducer,
  game: gameReducer,
  mint: mintReducer,
  nft: nftReducer,
  detail: detailReducer,
});

const persistConfig = {
  key: "root",
  version: 1,
  storage: storageSession,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // {
      //   ignoredActions: [
      //     FLUSH,
      //     REHYDRATE,
      //     PAUSE,
      //     PERSIST,
      //     PURGE,
      //     REGISTER,
      //     "game/setRoomList",
      //     "mint/setImgBlob",
      //   ],
      // },
    }),
});

export let persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
