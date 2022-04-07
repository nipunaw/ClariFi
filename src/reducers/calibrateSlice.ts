import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { Calibrate } from "enums/calibrate";

interface CalibrateState {
  currentState: Calibrate;
  deviceId: string | null;
  testName: string | null;
}

const initialState: CalibrateState = {
  currentState: Calibrate.initalMenu,
  deviceId: null,
  testName: null,
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
          state.currentState = Calibrate.prompt1;
          break;
        }
        case Calibrate.prompt1: {
          state.currentState = Calibrate.audioTest1;
          state.testName = "Ambient Noise";
          break;
        }
        case Calibrate.audioTest1: {
          state.currentState = Calibrate.processTest;
          break;
        }
        case Calibrate.processTest: {
          state.currentState = Calibrate.prompt2;
          break;
        }
        case Calibrate.prompt2: {
          state.currentState = Calibrate.audioTest2;
          state.testName = "Sibilant";
          break;
        }
        case Calibrate.audioTest2: {
          state.currentState = Calibrate.process;
          break;
        }
        case Calibrate.process: {
          state.currentState = Calibrate.initalMenu;
          break;
        }
      }
    },
    setDeviceId: (state, action: PayloadAction<string>) => {
      state.deviceId = action.payload;
    },
    setInitalState: (state) => {
      state.currentState = initialState.currentState;
      state.deviceId = initialState.deviceId;
      state.testName = initialState.testName;
    },
  },
});

// Action creators are generated for each case reducer function
export const { nextState, setDeviceId, setInitalState } =
  calibrateSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCalibrate = (state: RootState) => state.calibrate;

export default calibrateSlice.reducer;
