import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ApplicationState } from "enums/app";

interface AppState {
  currentState: ApplicationState;
}

const initialState: AppState = {
  currentState: ApplicationState.Calibrate,
};

export const appSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    calibrateState: (state) => {
      state.currentState = ApplicationState.Calibrate;
    },
    profileState: (state) => {
      state.currentState = ApplicationState.Profile;
    },
  },
});

// Action creators are generated for each case reducer function
export const { calibrateState, profileState } = appSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAppState = (state: RootState) => state.app.currentState;

export default appSlice.reducer;
