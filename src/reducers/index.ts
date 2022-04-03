import { combineReducers } from "redux";
import appSlice from "./appSlice";
import calibrateSlice from "./calibrateSlice";
import profileSlice from "./profileSlice";

export default combineReducers({
  profile: profileSlice,
  calibrate: calibrateSlice,
  app: appSlice,
});
