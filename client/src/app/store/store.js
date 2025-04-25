import { configureStore } from "@reduxjs/toolkit";
import toastSlice from "../slices/toast/toastSlice";
import { authApi } from "../../services/api/authApi";
import userSlice from "../slices/auth/userSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  user: userSlice,
  toasts: toastSlice,
});

export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      authApi.middleware
    ),
});
