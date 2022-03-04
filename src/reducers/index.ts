import { combineReducers } from "redux";
import calibrateSlice from "./calibrateSlice";
import profileSlice from "./profileSlice";

export default combineReducers({
  profile: profileSlice,
  calibrate: calibrateSlice,
});
