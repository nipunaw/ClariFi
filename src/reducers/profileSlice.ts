import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "types/profile";
import type { RootState } from "../store";

interface ProfileState {
  currentProfileId: number | null;
  nextProfileId: number;
  savedProfiles: Profile[];
}

const initialState: ProfileState = {
  currentProfileId: null,
  nextProfileId: 0,
  savedProfiles: [],
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<number>) => {
      state.currentProfileId = action.payload;
    },
    createProfile: (state, action: PayloadAction<Profile>) => {
      state.savedProfiles.push(action.payload);
      state.nextProfileId = state.nextProfileId + 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setProfile, createProfile } = profileSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectProfileId = (state: RootState) =>
  state.profile.currentProfileId;

export default profileSlice.reducer;
