import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  email: null,
  userName: null,
  userId: null,
};

const authFeature = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SET_ACTIVE_USER: (state, action) => {
      console.log(action.payload);
      const { email, userName, userId } = action.payload;
      state.isLoggedIn = true;
      state.email = email;
      state.userName = userName;
      state.userId = userId;
    },
  },
});

export const { SET_ACTIVE_USER } = authFeature.actions;

export const selectIsLoggedIn = (state) => state.auth.isLoggedIn;

export const selectEmail = (state) => state.auth.email;

export const selectUserName = (state) => state.auth.userName;

export const selectUserId = (state) => state.auth.useId;

export default authFeature.reducer;
