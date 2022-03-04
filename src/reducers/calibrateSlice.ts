import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Calibrate } from "enums/calibrate";
import { stat } from "fs";

interface CalibrateState {
  currentState: Calibrate;
  deviceId: string | null;
}

const initialState: CalibrateState = {
  currentState: Calibrate.deviceConfig,
  deviceId: null,
};

export const calibrateSlice = createSlice({
  name: "calibrate",
  initialState,
  reducers: {
    nextState: (state) => {
      switch (state.currentState) {
        case Calibrate.initalMenu: {
          state.currentState = Calibrate.deviceConfig;
          break;
        }
        case Calibrate.deviceConfig: {
          state.currentState = Calibrate.audioTest1;
          break;
        }
        case Calibrate.audioTest1: {
          state.currentState = Calibrate.audioTest2;
          break;
        }
        case Calibrate.audioTest2: {
          state.currentState = Calibrate.process;
          break;
        }
      }
    },
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { nextState, setDeviceId } = calibrateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCalibrate = (state: RootState) => state.calibrate;

export default calibrateSlice.reducer;
