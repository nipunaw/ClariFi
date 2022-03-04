import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Calibrate } from "enums/calibrate";

interface CalibrateState {
  currentState: Calibrate;
}

const initialState: CalibrateState = {
  currentState: Calibrate.initalMenu,
};

export const calibrateSlice = createSlice({
  name: "calibrate",
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<Calibrate>) => {
      state.currentState = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setState } = calibrateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectPaneTabArray = (state: RootState) => state.calibrateSlice.tabArray;

export default calibrateSlice.reducer;
