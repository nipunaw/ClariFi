import { combineReducers } from "redux";
import analysisSlice from "./analysisSlice";
import appSlice from "./appSlice";
import calibrateSlice from "./calibrateSlice";
import profileSlice from "./profileSlice";

export default combineReducers({
  profile: profileSlice,
  analysis: analysisSlice,
  calibrate: calibrateSlice,
  app: appSlice,
});
