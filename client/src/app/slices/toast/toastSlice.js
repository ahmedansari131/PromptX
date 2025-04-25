import { createSlice } from "@reduxjs/toolkit";

let nextToastId = 0;

const toastSlice = createSlice({
  name: "toasts",
  initialState: [],
  reducers: {
    addToast: (state, action) => {
      state.push({ id: nextToastId++, ...action.payload });
    },
    removeToast: (state, action) => {
      return state.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
