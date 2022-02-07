import { combineReducers } from "redux";
import profileSlice from "./profileSlice";

export default combineReducers({
  profile: profileSlice,
});
