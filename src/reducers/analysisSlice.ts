import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface AnalysisState {
  ambientData: any;
  sibilantData: any;
  coefficientData: any;
  samplingRate: any;
}

const initialState: AnalysisState = {
  ambientData: null,
  sibilantData: null,
  coefficientData: null,
  samplingRate: null
};

export const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    storeTestData: (
      state,
      action: PayloadAction<{ name: string; data: any }>
    ) => {
      if (action.payload.name == "Ambient Noise" && state.ambientData == null) {
        state.ambientData = action.payload.data;
      } else if (action.payload.name == "Sibilant") {
        state.sibilantData = action.payload.data;
      }
      else if (action.payload.name == "Sampling Rate") {
        state.samplingRate = action.payload.data;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { storeTestData } = analysisSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAnalysis = (state: RootState) => state.analysis;

export default analysisSlice.reducer;
