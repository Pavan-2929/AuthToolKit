import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"),
  currentUser: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
      state.isLoggedIn = true;
    },
    removeToken: (state) => {
      state.token = null;
      localStorage.removeItem("token");
      state.isLoggedIn = false;
      state.currentUser = {};
    },
    user: (state, action) => {
      state.currentUser = action.payload
      // console.log(state.currentUser);
    }
  },
});

export const { setToken, removeToken, user } = authSlice.actions;

export default authSlice.reducer;
