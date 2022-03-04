import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface ProfileState {
  currentProfileId: string | null;
}

const initialState: ProfileState = {
  currentProfileId: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<number>) => {},
  },
});

// Action creators are generated for each case reducer function
export const { setProfile } = profileSlice.actions;

// Other code such as selectors can use the imported `RootState` type
//export const selectPaneTabArray = (state: RootState) => state.profileSlice.tabArray;

export default profileSlice.reducer;
