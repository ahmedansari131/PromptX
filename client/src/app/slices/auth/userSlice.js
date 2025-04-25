import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state, actions) => {
      state.isLoggedIn = actions.payload.isLoggedIn;
      state.user = actions.payload.user;
    },
  },
});

export default userSlice.reducer;
export const { getUser } = userSlice.actions;